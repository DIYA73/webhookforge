import {
  Controller, Get, Param, UseGuards,
  Request, All, Req,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { Request as ExpressRequest } from 'express';

@Controller()
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @All('hook/:slug')
  capture(@Param('slug') slug: string, @Req() req: ExpressRequest) {
    return this.requestsService.capture(slug, req);
  }

  @UseGuards(JwtGuard)
  @Get('requests/:endpointId')
  findAll(@Param('endpointId') endpointId: string, @Request() req) {
    return this.requestsService.findAll(endpointId, req.user.workspace.id);
  }

  @UseGuards(JwtGuard)
  @Get('requests/detail/:id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.requestsService.findOne(id, req.user.workspace.id);
  }
}
