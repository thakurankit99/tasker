import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SelfPingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SelfPingService.name);
  private pingInterval: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const isEnabled = this.configService.get('SELF_PING_ENABLED', 'true') === 'true';
    const nodeEnv = this.configService.get('NODE_ENV', 'development');

    // Only enable self-ping in production
    if (nodeEnv !== 'production') {
      this.logger.log('Self-ping service disabled (not in production mode)');
      return;
    }

    if (!isEnabled) {
      this.logger.log('Self-ping service disabled by configuration');
      return;
    }

    const pingUrl = this.configService.get(
      'SELF_PING_URL',
      this.configService.get('SELF_PING_HOST', 'http://localhost:3000') + '/api/health',
    );

    this.logger.log(`Self-ping service enabled. Will ping ${pingUrl} every 3 minutes`);

    // Start pinging after 30 seconds to allow app to fully start
    setTimeout(() => {
      this.startPinging(pingUrl);
    }, 30000);
  }

  private startPinging(url: string) {
    this.pingInterval = setInterval(async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        this.logger.debug(`Self-ping successful: ${JSON.stringify(data)}`);
      } catch (error) {
        this.logger.error(`Self-ping failed: ${error.message}`);
      }
    }, this.PING_INTERVAL_MS);
  }

  onModuleDestroy() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.logger.log('Self-ping service stopped');
    }
  }
}

