import { Module } from '@nestjs/common';
import { WebhookGateway } from './webhook.gateway';

@Module({
  providers: [WebhookGateway],
  exports: [WebhookGateway],
})
export class GatewayModule {}
