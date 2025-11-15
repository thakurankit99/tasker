import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { SelfPingService } from './self-ping.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, SelfPingService],
  exports: [HealthService],
})
export class HealthModule {}

