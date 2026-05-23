import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ReplayService } from './replay.service';
import { ReplayController } from './replay.controller';
import { ReplayProcessor } from './replay.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'replay' })],
  providers: [ReplayService, ReplayProcessor],
  controllers: [ReplayController],
})
export class ReplayModule {}
