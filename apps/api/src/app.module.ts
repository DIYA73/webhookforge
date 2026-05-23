import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { EndpointsModule } from './endpoints/endpoints.module';
import { RequestsModule } from './requests/requests.module';
import { ReplayModule } from './replay/replay.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GatewayModule } from './gateway/gateway.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({ redis: process.env.REDIS_URL }),
    PrismaModule,
    AuthModule,
    EndpointsModule,
    RequestsModule,
    ReplayModule,
    AnalyticsModule,
    GatewayModule,
  ],
})
export class AppModule {}
