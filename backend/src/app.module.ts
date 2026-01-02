import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { AiIntegrationService } from './ai-integration.service.js';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService, AiIntegrationService],
})
export class AppModule {}
