import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async findAll(@Query('tenantId') tenantId?: string, @Query('customerId') customerId?: string) {
    return this.ticketsService.findAll(tenantId, customerId);
  }

  @Post()
  async create(@Body() body: any) {
    return this.ticketsService.create(body);
  }

  @Post(':id/dispatch-task')
  async dispatchTask(@Param('id') id: string, @Body() body: any) {
    return this.ticketsService.dispatchTask(id, body);
  }
}
