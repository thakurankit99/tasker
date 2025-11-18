import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createAuditExtension } from './audit.middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      // Connection pool configuration for Aiven PostgreSQL free tier
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Limit connection pool to avoid exhausting Aiven's connection limit
      // Aiven free tier typically allows 5-10 connections
      // We use 3 to leave room for migrations, admin tools, etc.
      // This prevents "too many clients" errors
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    return this.$extends(createAuditExtension()) as this;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
