import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeadStage } from '@prisma/client';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllLeads(tenantId?: string, stage?: LeadStage) {
    return this.prisma.lead.findMany({
      where: {
        ...(tenantId ? { tenantId } : {}),
        ...(stage ? { stage } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLead(data: {
    tenantId: string;
    contactName: string;
    companyName?: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    pestIssue?: string;
    estimatedValue?: number;
    notes?: string;
  }) {
    const count = await this.prisma.lead.count();
    const leadNumber = `LEAD-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return this.prisma.lead.create({
      data: {
        tenantId: data.tenantId,
        leadNumber,
        contactName: data.contactName,
        companyName: data.companyName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        pestIssue: data.pestIssue,
        estimatedValue: data.estimatedValue,
        notes: data.notes,
        stage: LeadStage.COLD,
      },
    });
  }

  async updateStage(id: string, stage: LeadStage, notes?: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead tidak ditemukan');

    return this.prisma.lead.update({
      where: { id },
      data: {
        stage,
        notes: notes ? `${lead.notes || ''}\n[${new Date().toLocaleDateString('id-ID')}] ${notes}` : lead.notes,
      },
    });
  }

  async convertToCustomer(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead tidak ditemukan');

    return this.prisma.$transaction(async (tx) => {
      // 1. Create customer
      const customer = await tx.customer.create({
        data: {
          tenantId: lead.tenantId,
          name: lead.contactName,
          companyName: lead.companyName,
          email: lead.email,
          phone: lead.phone,
          notes: `Dikonversi dari Lead: ${lead.leadNumber}. Masalah hama awal: ${lead.pestIssue || '-'}`,
          locations: {
            create: {
              branchName: 'Kantor / Lokasi Utama',
              address: lead.address || 'Jakarta',
              latitude: -6.2088,
              longitude: 106.8456,
              geofenceRadius: 100,
              picName: lead.contactName,
              picPhone: lead.phone,
            },
          },
        },
        include: { locations: true },
      });

      // 2. Mark lead as WON
      await tx.lead.update({
        where: { id },
        data: {
          stage: LeadStage.WON,
          convertedAt: new Date(),
        },
      });

      return customer;
    });
  }
}
