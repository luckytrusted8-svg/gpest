import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(@Query('tenantId') tenantId?: string) {
    return this.customersService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.customersService.create(body);
  }

  @Post(':id/locations')
  async addLocation(@Param('id') customerId: string, @Body() body: any) {
    return this.customersService.addLocation(customerId, body);
  }
}
