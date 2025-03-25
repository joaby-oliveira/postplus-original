import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const existingCompany = await this.prisma.company.findUnique({
      where: { email: createCompanyDto.email },
    });

    if (existingCompany) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createCompanyDto.password, 10);

    return this.prisma.company.create({
      data: {
        ...createCompanyDto,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    const companies = await this.prisma.company.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cnpj: true,
        whatsapp: true,
        logoUrl: true,
        street: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true,
        updatedAt: true,
        downloads: true,
      }
    });

    return companies.map(company => ({
      ...company,
      logoUrl: company.logoUrl?.replace('localstack:4566', 'localhost:4566')
    }));
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        cnpj: true,
        whatsapp: true,
        logoUrl: true,
        street: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true,
        updatedAt: true,
        downloads: {
          include: {
            art: true,
          }
        },
      }
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return {
      ...company,
      logoUrl: company.logoUrl?.replace('localstack:4566', 'localhost:4566')
    };
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);

    if (updateCompanyDto.password) {
      updateCompanyDto.password = await bcrypt.hash(updateCompanyDto.password, 10);
    }

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.company.delete({
      where: { id },
    });
  }

  async uploadLogo(id: string, file: Express.Multer.File) {
    await this.findOne(id);

    const key = `companies/${id}/logo-${Date.now()}-${file.originalname}`;
    const logoUrl = await this.s3Service.uploadFile(file, key);

    return this.prisma.company.update({
      where: { id },
      data: { logoUrl },
    });
  }
} 