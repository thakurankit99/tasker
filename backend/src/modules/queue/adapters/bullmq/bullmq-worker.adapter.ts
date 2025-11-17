import { Worker, WorkerOptions, Job } from 'bullmq';
import { IWorker, WorkerProcessor } from '../../interfaces/worker.interface';
import { BullMQJobAdapter } from './bullmq-job.adapter';
import { IJob } from '../../interfaces/job.interface';
import { Logger } from '@nestjs/common';

/**
 * BullMQ Worker Adapter - Wraps BullMQ Worker to implement IWorker interface
 */
export class BullMQWorkerAdapter<T = any> implements IWorker<T> {
  private readonly worker: Worker<T>;
  private readonly processor: WorkerProcessor<T>;
  private readonly logger = new Logger(`BullMQWorker`);

  constructor(queueName: string, processor: WorkerProcessor<T>, options: WorkerOptions) {
    this.processor = processor;

    // Wrap the processor to convert BullMQ Job to IJob
    this.worker = new Worker<T>(
      queueName,
      async (job: Job<T>): Promise<any> => {
        const wrappedJob = new BullMQJobAdapter(job);
        return await this.processor(wrappedJob);
      },
      options,
    );

    // Add event listeners for debugging
    this.worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} in queue "${queueName}" completed`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} in queue "${queueName}" failed:`, err);
    });

    this.worker.on('error', (err) => {
      this.logger.error(`Worker error in queue "${queueName}":`, err);
    });

    this.logger.log(`Worker started for queue "${queueName}"`);
  }

  get name(): string {
    return this.worker.name;
  }

  async process(job: IJob<T>): Promise<any> {
    // This method is not directly called - BullMQ handles processing internally
    // Included for interface compliance
    return await this.processor(job);
  }

  async close(): Promise<void> {
    await this.worker.close();
  }

  async pause(): Promise<void> {
    await this.worker.pause();
  }

  resume(): Promise<void> {
    this.worker.resume();
    return Promise.resolve();
  }

  /**
   * Get the underlying BullMQ worker (for advanced use cases)
   */
  getUnderlyingWorker(): Worker<T> {
    return this.worker;
  }
}
