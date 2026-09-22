import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus, TicketStatus, Role } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardSummary(tenantId?: string) {
    const whereTenant = tenantId ? { tenantId } : {};

    const [
      totalCustomers,
      totalContracts,
      totalTasks,
      completedTasks,
      openTickets,
      activeTechnicians,
      recentTasks,
      recentLeads,
      services,
    ] = await Promise.all([
      this.prisma.customer.count({ where: whereTenant }),
      this.prisma.contract.count({ where: { ...whereTenant, status: 'ACTIVE' } }),
      this.prisma.task.count({ where: whereTenant }),
      this.prisma.task.count({ where: { ...whereTenant, status: TaskStatus.COMPLETED } }),
      this.prisma.ticket.count({ where: { ...whereTenant, status: TicketStatus.OPEN } }),
      this.prisma.user.count({ where: { ...whereTenant, role: Role.TECHNICIAN } }),
      this.prisma.task.findMany({
        where: whereTenant,
        include: {
          customer: true,
          customerLocation: true,
          technician: true,
        },
        orderBy: { scheduledDate: 'desc' },
        take: 5,
      }),
      this.prisma.lead.findMany({
        where: whereTenant,
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.serviceCatalog.findMany({
        where: whereTenant,
      }),
    ]);

    return {
      kpi: {
        totalCustomers,
        activeContracts: totalContracts,
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        openTickets,
        activeTechnicians,
      },
      recentTasks,
      recentLeads,
      services,
    };
  }
}
