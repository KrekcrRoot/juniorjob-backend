import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ServerController } from './server.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [ServerController],
})
export class ServerModule {}
