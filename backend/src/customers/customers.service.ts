import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId?: string) {
    return this.prisma.customer.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        locations: true,
        contracts: true,
        _count: {
          select: { tasks: true, tickets: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        locations: true,
        contracts: {
          include: { serviceCatalog: true },
        },
        tasks: {
          include: { technician: true, workReport: true },
          orderBy: { scheduledDate: 'desc' },
          take: 10,
        },
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer tidak ditemukan');
    }

    return customer;
  }

  async create(data: {
    tenantId: string;
    name: string;
    companyName?: string;
    email?: string;
    phone: string;
    notes?: string;
    initialBranchName?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    geofenceRadius?: number;
  }) {
    return this.prisma.customer.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
        locations: {
          create: {
            branchName: data.initialBranchName || 'Lokasi Utama',
            address: data.address || 'Jakarta',
            latitude: data.latitude ?? -6.2088,
            longitude: data.longitude ?? 106.8456,
            geofenceRadius: data.geofenceRadius ?? 100,
          },
        },
      },
      include: { locations: true },
    });
  }

  async addLocation(
    customerId: string,
    data: {
      branchName: string;
      address: string;
      latitude: number;
      longitude: number;
      geofenceRadius?: number;
      picName?: string;
      picPhone?: string;
    },
  ) {
    return this.prisma.customerLocation.create({
      data: {
        customerId,
        branchName: data.branchName,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        geofenceRadius: data.geofenceRadius ?? 100,
        picName: data.picName,
        picPhone: data.picPhone,
      },
    });
  }
}
