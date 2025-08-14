import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  HealthCheckResult
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator
  ) {}

  @Get('/check')
  async healthCheck(): Promise<{ status: string }> {
    return { status: 'ok' };
  }

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT ?? 3000;
    const apiVersion = process.env.API_VERSION ?? 'v1';

    return this.health.check([
      () => this.http.pingCheck('google', 'https://google.com'),
      () =>
        this.http.pingCheck(
          'service connection',
          `http://${host}:${port}/api/${apiVersion}/health/check`
        ),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9
        }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024)
    ]);
  }
}
