import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService, S3Service],
})
export class CompanyModule {} 