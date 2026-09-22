import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TrackingModule } from './tracking/tracking.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { CrmModule } from './crm/crm.module';
import { TasksModule } from './tasks/tasks.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { TicketsModule } from './tickets/tickets.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    TrackingModule,
    AuthModule,
    CustomersModule,
    CrmModule,
    TasksModule,
    MonitoringModule,
    TicketsModule,
    AttendanceModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
