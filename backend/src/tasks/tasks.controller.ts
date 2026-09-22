import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query('tenantId') tenantId?: string,
    @Query('technicianId') technicianId?: string,
    @Query('status') status?: TaskStatus,
  ) {
    return this.tasksService.findAll({ tenantId, technicianId, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id/start-trip')
  async startTrip(@Param('id') id: string) {
    return this.tasksService.startTrip(id);
  }

  @Post(':id/check-in')
  async checkIn(
    @Param('id') id: string,
    @Body() body: { latitude: number; longitude: number; overrideReason?: string },
  ) {
    return this.tasksService.checkIn(id, body);
  }

  @Post(':id/work-report')
  async submitWorkReport(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.submitWorkReport(id, body);
  }
}
