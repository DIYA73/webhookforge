import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { WebhookGateway } from '../gateway/webhook.gateway';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private gateway: WebhookGateway,
  ) {}

  async capture(slug: string, req: ExpressRequest) {
    const endpoint = await this.prisma.endpoint.findUnique({ where: { slug } });
    if (!endpoint) throw new NotFoundException('Endpoint not found');

    const body = req.body ?? {};
    const headers = req.headers as Record<string, string>;
    const query = req.query as Record<string, string>;
    const size = Buffer.byteLength(JSON.stringify(body));

    const captured = await this.prisma.request.create({
      data: {
        endpointId: endpoint.id,
        method: req.method,
        headers,
        body,
        query,
        ip: req.ip ?? 'unknown',
        userAgent: req.headers['user-agent'] ?? '',
        size,
      },
    });

    this.gateway.emitNewRequest(endpoint.id, {
      ...captured,
      endpointSlug: slug,
    });

    return { received: true };
  }

  async findAll(endpointId: string, workspaceId: string) {
    const endpoint = await this.prisma.endpoint.findUnique({
      where: { id: endpointId },
    });
    if (!endpoint || endpoint.workspaceId !== workspaceId)
      throw new NotFoundException('Endpoint not found');

    return this.prisma.request.findMany({
      where: { endpointId },
      orderBy: { receivedAt: 'desc' },
      take: 100,
    });
  }

  async findOne(id: string, workspaceId: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: { endpoint: true },
    });
    if (!request || request.endpoint.workspaceId !== workspaceId)
      throw new NotFoundException('Request not found');

    return request;
  }
}
