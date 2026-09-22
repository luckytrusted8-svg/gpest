import { Controller, Get, Query } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('technicians/status')
  async getTechniciansStatus(@Query('tenantId') tenantId?: string) {
    return this.monitoringService.getTechniciansStatus(tenantId);
  }
}
