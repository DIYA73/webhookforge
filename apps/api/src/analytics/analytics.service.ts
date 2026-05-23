import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(workspaceId: string) {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { workspaceId },
      select: { id: true },
    });

    const endpointIds = endpoints.map((e) => e.id);

    const [totalRequests, totalReplays, successReplays] = await Promise.all([
      this.prisma.request.count({
        where: { endpointId: { in: endpointIds } },
      }),
      this.prisma.replayJob.count({
        where: { request: { endpointId: { in: endpointIds } } },
      }),
      this.prisma.replayJob.count({
        where: {
          status: 'SUCCESS',
          request: { endpointId: { in: endpointIds } },
        },
      }),
    ]);

    const avgResponseTime = await this.prisma.replayJob.aggregate({
      where: {
        status: 'SUCCESS',
        request: { endpointId: { in: endpointIds } },
      },
      _avg: { responseTime: true },
    });

    return {
      totalRequests,
      totalEndpoints: endpoints.length,
      totalReplays,
      replaySuccessRate: totalReplays > 0
        ? Math.round((successReplays / totalReplays) * 100)
        : 0,
      avgResponseTime: Math.round(avgResponseTime._avg.responseTime ?? 0),
    };
  }

  async getTimeline(workspaceId: string, days: number = 7) {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { workspaceId },
      select: { id: true },
    });

    const endpointIds = endpoints.map((e) => e.id);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const requests = await this.prisma.request.findMany({
      where: {
        endpointId: { in: endpointIds },
        receivedAt: { gte: since },
      },
      select: { receivedAt: true },
      orderBy: { receivedAt: 'asc' },
    });

    const grouped: Record<string, number> = {};

    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().split('T')[0];
      grouped[key] = 0;
    }

    for (const req of requests) {
      const key = req.receivedAt.toISOString().split('T')[0];
      if (grouped[key] !== undefined) grouped[key]++;
    }

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }

  async getTopEndpoints(workspaceId: string) {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { workspaceId },
      include: { _count: { select: { requests: true } } },
      orderBy: { requests: { _count: 'desc' } },
      take: 5,
    });

    return endpoints.map((e) => ({
      id: e.id,
      name: e.name,
      slug: e.slug,
      requestCount: e._count.requests,
      url: `${process.env.WEBHOOK_BASE_URL}/${e.slug}`,
    }));
  }

  async getMethodBreakdown(workspaceId: string) {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { workspaceId },
      select: { id: true },
    });

    const endpointIds = endpoints.map((e) => e.id);

    const requests = await this.prisma.request.groupBy({
      by: ['method'],
      where: { endpointId: { in: endpointIds } },
      _count: { method: true },
      orderBy: { _count: { method: 'desc' } },
    });

    return requests.map((r) => ({
      method: r.method,
      count: r._count.method,
    }));
  }
}
