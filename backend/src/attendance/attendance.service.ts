import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId?: string, userId?: string) {
    return this.prisma.attendance.findMany({
      where: {
        ...(tenantId ? { tenantId } : {}),
        ...(userId ? { userId } : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, phone: true, role: true },
        },
      },
      orderBy: { clockInTime: 'desc' },
      take: 50,
    });
  }

  async checkIn(data: {
    tenantId: string;
    userId: string;
    latitude?: number;
    longitude?: number;
    selfieUrl?: string;
  }) {
    return this.prisma.attendance.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        clockInTime: new Date(),
        clockInLat: data.latitude,
        clockInLng: data.longitude,
        selfieUrl: data.selfieUrl,
        status: AttendanceStatus.PRESENT,
      },
    });
  }

  async checkOut(id: string, data: { latitude?: number; longitude?: number }) {
    const attendance = await this.prisma.attendance.findUnique({ where: { id } });
    if (!attendance) throw new NotFoundException('Data absensi tidak ditemukan');

    return this.prisma.attendance.update({
      where: { id },
      data: {
        clockOutTime: new Date(),
        clockOutLat: data.latitude,
        clockOutLng: data.longitude,
      },
    });
  }
}
