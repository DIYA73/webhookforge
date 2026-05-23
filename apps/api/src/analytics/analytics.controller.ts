import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary(@Request() req) {
    return this.analyticsService.getSummary(req.user.workspace.id);
  }

  @Get('timeline')
  getTimeline(@Request() req, @Query('days') days?: string) {
    return this.analyticsService.getTimeline(
      req.user.workspace.id,
      days ? parseInt(days) : 7,
    );
  }

  @Get('top-endpoints')
  getTopEndpoints(@Request() req) {
    return this.analyticsService.getTopEndpoints(req.user.workspace.id);
  }

  @Get('methods')
  getMethodBreakdown(@Request() req) {
    return this.analyticsService.getMethodBreakdown(req.user.workspace.id);
  }
}
