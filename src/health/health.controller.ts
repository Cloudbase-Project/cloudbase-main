import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
  //   MicroserviceHealthIndicator,
} from '@nestjs/terminus';

// FOR PERFORMING HEALTHCHECKS.
// Check out https://docs.nestjs.com/recipes/terminus

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoCheck: MongooseHealthIndicator, // private microservice: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // () => this.microservice.pingCheck("MICROSERVICE NAME", { ...options }) // CHECK IF THE MICROSERVICE IS REACHABLE
      () => this.mongoCheck.pingCheck('mongodb'),
    ]);
  }
}
