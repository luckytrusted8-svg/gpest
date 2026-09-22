import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus, TicketPriority, TaskStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId?: string, customerId?: string) {
    return this.prisma.ticket.findMany({
      where: {
        ...(tenantId ? { tenantId } : {}),
        ...(customerId ? { customerId } : {}),
      },
      include: {
        customer: true,
        customerLocation: true,
        assignedTo: {
          select: { id: true, name: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    tenantId: string;
    customerId: string;
    customerLocationId?: string;
    title: string;
    description: string;
    priority?: TicketPriority;
  }) {
    const count = await this.prisma.ticket.count();
    const ticketNumber = `TCK-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return this.prisma.ticket.create({
      data: {
        tenantId: data.tenantId,
        customerId: data.customerId,
        customerLocationId: data.customerLocationId,
        ticketNumber,
        title: data.title,
        description: data.description,
        priority: data.priority || TicketPriority.HIGH,
        status: TicketStatus.OPEN,
      },
      include: { customer: true },
    });
  }

  async dispatchTask(
    ticketId: string,
    data: {
      technicianId: string;
      scheduledDate: string;
      timeSlot?: string;
      notes?: string;
    },
  ) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { customer: { include: { locations: true } } },
    });

    if (!ticket) throw new NotFoundException('Tiket tidak ditemukan');

    const locationId = ticket.customerLocationId || ticket.customer.locations[0]?.id;
    if (!locationId) throw new NotFoundException('Lokasi customer belum ada');

    const count = await this.prisma.task.count();
    const taskNumber = `TSK-WARRANTY-${String(count + 1).padStart(4, '0')}`;

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Follow-up / Warranty Task
      const task = await tx.task.create({
        data: {
          tenantId: ticket.tenantId,
          customerId: ticket.customerId,
          customerLocationId: locationId,
          technicianId: data.technicianId,
          taskNumber,
          status: TaskStatus.ASSIGNED,
          scheduledDate: new Date(data.scheduledDate),
          timeSlot: data.timeSlot || '09:00 - 11:00 WIB',
          priority: 'EMERGENCY',
        },
      });

      // 2. Update Ticket to IN_PROGRESS
      await tx.ticket.update({
        where: { id: ticketId },
        data: {
          status: TicketStatus.IN_PROGRESS,
          assignedToUserId: data.technicianId,
          resolutionNotes: `Dispatched to Task: ${taskNumber}. ${data.notes || ''}`,
        },
      });

      return { ticketId, createdTask: task };
    });
  }
}
