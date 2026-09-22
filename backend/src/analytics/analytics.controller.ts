import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardSummary(@Query('tenantId') tenantId?: string) {
    return this.analyticsService.getDashboardSummary(tenantId);
  }
}
