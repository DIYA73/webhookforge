import { Module } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { EndpointsController } from './endpoints.controller';

@Module({
  providers: [EndpointsService],
  controllers: [EndpointsController],
  exports: [EndpointsService],
})
export class EndpointsModule {}
