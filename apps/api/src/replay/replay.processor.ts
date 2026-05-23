import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../common/prisma/prisma.service';

export interface ReplayJobData {
  replayJobId: string;
  targetUrl: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

@Processor('replay')
export class ReplayProcessor {
  private logger = new Logger('ReplayProcessor');

  constructor(private prisma: PrismaService) {}

  @Process('send')
  async handleReplay(job: Job<ReplayJobData>) {
    const { replayJobId, targetUrl, method, headers, body } = job.data;

    await this.prisma.replayJob.update({
      where: { id: replayJobId },
      data: { status: 'RUNNING', attempts: job.attemptsMade + 1 },
    });

    const start = Date.now();

    try {
      const safeHeaders: Record<string, string> = {
        'content-type': 'application/json',
      };

      if (headers['x-webhook-signature'])
        safeHeaders['x-webhook-signature'] = headers['x-webhook-signature'];

      const res = await fetch(targetUrl, {
        method: method || 'POST',
        headers: safeHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseTime = Date.now() - start;

      await this.prisma.replayJob.update({
        where: { id: replayJobId },
        data: {
          status: res.ok ? 'SUCCESS' : 'FAILED',
          responseStatus: res.status,
          responseTime,
          error: res.ok ? null : `HTTP ${res.status}`,
        },
      });

      this.logger.log(`Replay ${replayJobId} → ${res.status} in ${responseTime}ms`);
    } catch (err) {
      const responseTime = Date.now() - start;
      await this.prisma.replayJob.update({
        where: { id: replayJobId },
        data: { status: 'FAILED', responseTime, error: err.message },
      });
      this.logger.error(`Replay ${replayJobId} failed: ${err.message}`);
      throw err;
    }
  }
}
