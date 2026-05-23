import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReplayService } from './replay.service';
import { CreateReplayDto } from './dto/create-replay.dto';
import { JwtGuard } from '../common/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('replay')
export class ReplayController {
  constructor(private replayService: ReplayService) {}

  @Post()
  create(@Body() dto: CreateReplayDto, @Request() req) {
    return this.replayService.create(dto, req.user.workspace.id);
  }

  @Get('request/:requestId')
  findAll(@Param('requestId') requestId: string, @Request() req) {
    return this.replayService.findAll(requestId, req.user.workspace.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.replayService.findOne(id, req.user.workspace.id);
  }
}
