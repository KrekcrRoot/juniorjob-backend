import { Controller, Get, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@ApiTags('Server')
@Controller('server')
export class ServerController {

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get('/health')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('internet', 'https://8.8.8.8'),
      () => this.http.pingCheck('api', 'https://api.junior-job.ru/server/ping'),
      () => this.http.pingCheck('frontend', 'https://junior-job.ru'),
      () => this.http.pingCheck('chat api', 'https://chatapi.junior-job.ru')
    ]);
  }

  @Get('/info')
  info(@Headers() headers: Headers) {
    return headers;
  }

  @Get('/ping')
  async ping() {
    const response = {
      response: 'pong',
      message: 'evetything is fine',
    };

    return response;
  }

}
