import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailProcessor } from './email.processor';
import { PrismaModule } from '../../prisma/prisma.module';
import { QueueModule } from '../queue/queue.module';
import { QueueService } from '../queue/services/queue.service';

@Module({
  imports: [
    PrismaModule,
    QueueModule,
    QueueModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule implements OnModuleInit {
  private readonly logger = new Logger(EmailModule.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly emailProcessor: EmailProcessor,
  ) {}

  async onModuleInit() {
    try {
      // Get the queue adapter
      const adapter = this.queueService.getAdapter();

      if (!adapter) {
        this.logger.error('Queue adapter not initialized');
        return;
      }

      // Create worker for email queue
      adapter.createWorker('email', async (job) => {
        this.logger.log(`[EMAIL WORKER] Processing job ${job.id} for ${job.data.to}`);
        try {
          const result = await this.emailProcessor.process(job);
          this.logger.log(`[EMAIL WORKER] Job ${job.id} completed successfully`);
          return result;
        } catch (error) {
          this.logger.error(`[EMAIL WORKER] Job ${job.id} failed:`, error);
          throw error;
        }
      });

      this.logger.log('Email worker registered successfully');
    } catch (error) {
      this.logger.error('Failed to register email worker:', error);
    }
  }
}
