import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EndpointsModule } from './endpoints/endpoints.module';
import { RequestsModule } from './requests/requests.module';
import { GatewayModule } from './gateway/gateway.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    EndpointsModule,
    RequestsModule,
    GatewayModule,
  ],
})
export class AppModule {}
