import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { CrmService } from './crm.service';
import { LeadStage } from '@prisma/client';

@Controller('leads')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get()
  async findAll(@Query('tenantId') tenantId?: string, @Query('stage') stage?: LeadStage) {
    return this.crmService.findAllLeads(tenantId, stage);
  }

  @Post()
  async create(@Body() body: any) {
    return this.crmService.createLead(body);
  }

  @Patch(':id/stage')
  async updateStage(
    @Param('id') id: string,
    @Body() body: { stage: LeadStage; notes?: string },
  ) {
    return this.crmService.updateStage(id, body.stage, body.notes);
  }

  @Post(':id/convert')
  async convert(@Param('id') id: string) {
    return this.crmService.convertToCustomer(id);
  }
}
