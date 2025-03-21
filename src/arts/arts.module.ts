import { Module } from '@nestjs/common';
import { ArtsService } from './arts.service';
import { ArtsController } from './arts.controller';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';

@Module({
  controllers: [ArtsController],
  providers: [ArtsService, PrismaService, S3Service],
})
export class ArtsModule {} 