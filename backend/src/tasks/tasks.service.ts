import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: {
    tenantId?: string;
    technicianId?: string;
    status?: TaskStatus;
    date?: string;
  }) {
    return this.prisma.task.findMany({
      where: {
        ...(query?.tenantId ? { tenantId: query.tenantId } : {}),
        ...(query?.technicianId ? { technicianId: query.technicianId } : {}),
        ...(query?.status ? { status: query.status } : {}),
      },
      include: {
        customer: true,
        customerLocation: true,
        serviceCatalog: true,
        technician: {
          select: { id: true, name: true, phone: true, role: true },
        },
        workReport: true,
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        customer: true,
        customerLocation: true,
        serviceCatalog: true,
        technician: {
          select: { id: true, name: true, phone: true },
        },
        workReport: {
          include: {
            chemicalsUsed: true,
            photos: true,
          },
        },
      },
    });

    if (!task) throw new NotFoundException('Tugas tidak ditemukan');
    return task;
  }

  async startTrip(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Tugas tidak ditemukan');

    return this.prisma.task.update({
      where: { id },
      data: {
        status: TaskStatus.EN_ROUTE,
        departureTime: new Date(),
      },
    });
  }

  async checkIn(id: string, data: { latitude: number; longitude: number; overrideReason?: string }) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { customerLocation: true },
    });

    if (!task) throw new NotFoundException('Tugas tidak ditemukan');

    const site = task.customerLocation;
    const distanceMeters = calculateDistanceMeters(
      data.latitude,
      data.longitude,
      site.latitude,
      site.longitude,
    );

    const isWithinGeofence = distanceMeters <= site.geofenceRadius;

    if (!isWithinGeofence && !data.overrideReason) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'GEOFENCE_WARNING',
        distanceMeters,
        allowedRadius: site.geofenceRadius,
        error: `Anda berada ${distanceMeters}m dari lokasi (radius toleransi: ${site.geofenceRadius}m). Masukkan alasan jika ingin bypass.`,
      });
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        status: TaskStatus.ON_SITE,
        actualStartTime: new Date(),
        geofenceDeviation: distanceMeters,
        deviationReason: data.overrideReason || null,
      },
    });
  }

  async submitWorkReport(
    id: string,
    reportData: {
      dynamicData: any;
      recommendations?: string;
      customerPicName: string;
      signatureUrl: string;
      chemicals?: Array<{
        name: string;
        amountUsed: number;
        unit: string;
        batchNumber?: string;
        method?: string;
      }>;
      photos?: Array<{
        photoUrl: string;
        photoType: string;
        caption?: string;
      }>;
    },
  ) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Tugas tidak ditemukan');

    const count = await this.prisma.workReport.count();
    const reportNumber = `WR-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Work Report
      const report = await tx.workReport.create({
        data: {
          taskId: id,
          reportNumber,
          dynamicData: reportData.dynamicData,
          recommendations: reportData.recommendations,
          customerPicName: reportData.customerPicName,
          signatureUrl: reportData.signatureUrl,
          signedAt: new Date(),
          chemicalsUsed: reportData.chemicals
            ? {
                create: reportData.chemicals.map((c) => ({
                  name: c.name,
                  amountUsed: c.amountUsed,
                  unit: c.unit,
                  batchNumber: c.batchNumber,
                  method: c.method,
                })),
              }
            : undefined,
          photos: reportData.photos
            ? {
                create: reportData.photos.map((p) => ({
                  photoUrl: p.photoUrl,
                  photoType: p.photoType,
                  caption: p.caption,
                })),
              }
            : undefined,
        },
        include: { chemicalsUsed: true, photos: true },
      });

      // 2. Mark Task as COMPLETED
      await tx.task.update({
        where: { id },
        data: {
          status: TaskStatus.COMPLETED,
          actualEndTime: new Date(),
        },
      });

      return report;
    });
  }
}
