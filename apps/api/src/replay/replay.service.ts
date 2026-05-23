import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateReplayDto } from './dto/create-replay.dto';

@Injectable()
export class ReplayService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('replay') private replayQueue: Queue,
  ) {}

  async create(dto: CreateReplayDto, workspaceId: string) {
    const request = await this.prisma.request.findUnique({
      where: { id: dto.requestId },
      include: { endpoint: true },
    });

    if (!request || request.endpoint.workspaceId !== workspaceId)
      throw new NotFoundException('Request not found');

    const replayJob = await this.prisma.replayJob.create({
      data: {
        requestId: dto.requestId,
        targetUrl: dto.targetUrl,
        maxAttempts: dto.maxAttempts ?? 3,
        status: 'PENDING',
      },
    });

    await this.replayQueue.add(
      'send',
      {
        replayJobId: replayJob.id,
        targetUrl: dto.targetUrl,
        method: request.method,
        headers: request.headers as Record<string, string>,
        body: request.body,
      },
      {
        attempts: dto.maxAttempts ?? 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );

    return replayJob;
  }

  async findAll(requestId: string, workspaceId: string) {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: { endpoint: true },
    });
    if (!request || request.endpoint.workspaceId !== workspaceId)
      throw new NotFoundException('Request not found');

    return this.prisma.replayJob.findMany({
      where: { requestId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, workspaceId: string) {
    const job = await this.prisma.replayJob.findUnique({
      where: { id },
      include: { request: { include: { endpoint: true } } },
    });
    if (!job || job.request.endpoint.workspaceId !== workspaceId)
      throw new NotFoundException('Replay job not found');

    return job;
  }
}
