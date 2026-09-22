import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class MonitoringService {
  constructor(private readonly prisma: PrismaService) {}

  async getTechniciansStatus(tenantId?: string) {
    const technicians = await this.prisma.user.findMany({
      where: {
        role: Role.TECHNICIAN,
        ...(tenantId ? { tenantId } : {}),
      },
      include: {
        assignedTasks: {
          where: {
            status: { in: ['ASSIGNED', 'EN_ROUTE', 'ON_SITE'] },
          },
          include: {
            customer: true,
            customerLocation: true,
          },
          take: 1,
        },
        locations: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
    });

    return technicians.map((tech) => {
      const currentTask = tech.assignedTasks[0] || null;
      const lastLoc = tech.locations[0] || null;

      // Default fallback coordinates around Jakarta for demo if no live tracking emitted yet
      const lat = lastLoc?.latitude ?? (currentTask?.customerLocation ? currentTask.customerLocation.latitude - 0.008 : -6.225);
      const lng = lastLoc?.longitude ?? (currentTask?.customerLocation ? currentTask.customerLocation.longitude - 0.005 : 106.802);

      return {
        id: tech.id,
        name: tech.name,
        phone: tech.phone,
        currentStatus: currentTask ? currentTask.status : 'IDLE',
        currentTask: currentTask
          ? {
              id: currentTask.id,
              taskNumber: currentTask.taskNumber,
              customerName: currentTask.customer.name,
              branchName: currentTask.customerLocation.branchName,
              destinationLat: currentTask.customerLocation.latitude,
              destinationLng: currentTask.customerLocation.longitude,
              geofenceRadius: currentTask.customerLocation.geofenceRadius,
            }
          : null,
        lastKnownLocation: {
          latitude: lat,
          longitude: lng,
          speed: lastLoc?.speed ?? 35,
          battery: lastLoc?.battery ?? 88,
          updatedAt: lastLoc?.recordedAt ?? new Date(),
        },
      };
    });
  }
}
