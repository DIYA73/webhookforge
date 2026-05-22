import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class EndpointsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEndpointDto, workspaceId: string) {
    const slug = nanoid(12);
    return this.prisma.endpoint.create({
      data: {
        name: dto.name,
        slug,
        workspaceId,
      },
    });
  }

  async findAll(workspaceId: string) {
    const endpoints = await this.prisma.endpoint.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { requests: true } } },
    });

    return endpoints.map((e) => ({
      ...e,
      requestCount: e._count.requests,
      url: `${process.env.WEBHOOK_BASE_URL}/${e.slug}`,
    }));
  }

  async findOne(slug: string, workspaceId: string) {
    const endpoint = await this.prisma.endpoint.findUnique({
      where: { slug },
      include: { _count: { select: { requests: true } } },
    });

    if (!endpoint) throw new NotFoundException('Endpoint not found');
    if (endpoint.workspaceId !== workspaceId)
      throw new ForbiddenException('Access denied');

    return {
      ...endpoint,
      requestCount: endpoint._count.requests,
      url: `${process.env.WEBHOOK_BASE_URL}/${endpoint.slug}`,
    };
  }

  async remove(id: string, workspaceId: string) {
    const endpoint = await this.prisma.endpoint.findUnique({ where: { id } });
    if (!endpoint) throw new NotFoundException('Endpoint not found');
    if (endpoint.workspaceId !== workspaceId)
      throw new ForbiddenException('Access denied');

    await this.prisma.endpoint.delete({ where: { id } });
    return { message: 'Endpoint deleted' };
  }
}
