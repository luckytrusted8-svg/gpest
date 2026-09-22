import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async findAll(@Query('tenantId') tenantId?: string, @Query('userId') userId?: string) {
    return this.attendanceService.findAll(tenantId, userId);
  }

  @Post('check-in')
  async checkIn(@Body() body: any) {
    return this.attendanceService.checkIn(body);
  }

  @Patch(':id/check-out')
  async checkOut(@Param('id') id: string, @Body() body: any) {
    return this.attendanceService.checkOut(id, body);
  }
}
