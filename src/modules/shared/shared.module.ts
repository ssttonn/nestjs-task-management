import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { ScopeService } from './services/scope/scope.service';

@Module({
  providers: [PrismaService, ScopeService],
  exports: [PrismaService, ScopeService],
})
export class SharedModule {}
