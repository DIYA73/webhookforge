import {
  Controller, Get, Post, Delete,
  Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { JwtGuard } from '../common/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('endpoints')
export class EndpointsController {
  constructor(private endpointsService: EndpointsService) {}

  @Post()
  create(@Body() dto: CreateEndpointDto, @Request() req) {
    return this.endpointsService.create(dto, req.user.workspace.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.endpointsService.findAll(req.user.workspace.id);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Request() req) {
    return this.endpointsService.findOne(slug, req.user.workspace.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.endpointsService.remove(id, req.user.workspace.id);
  }
}
