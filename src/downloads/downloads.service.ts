import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDownloadDto } from './dto/create-download.dto';

@Injectable()
export class DownloadsService {
  constructor(private prisma: PrismaService) {}

  async create(createDownloadDto: CreateDownloadDto, companyId: string) {
    // Verify art exists
    const art = await this.prisma.art.findUnique({
      where: { id: createDownloadDto.artId },
    });

    if (!art) {
      throw new NotFoundException(`Art with ID ${createDownloadDto.artId} not found`);
    }

    return this.prisma.download.create({
      data: {
        artId: createDownloadDto.artId,
        companyId,
      },
      include: {
        art: true,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.download.findMany({
      where: { companyId },
      include: {
        art: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const download = await this.prisma.download.findFirst({
      where: { id, companyId },
      include: {
        art: true,
      },
    });

    if (!download) {
      throw new NotFoundException(`Download with ID ${id} not found`);
    }

    return download;
  }

  async getDownloadStats(companyId: string) {
    const downloads = await this.prisma.download.findMany({
      where: { companyId },
      include: {
        art: true,
      },
    });

    const stats = {
      totalDownloads: downloads.length,
      downloadsByCategory: {},
      downloadsByType: {},
    };

    downloads.forEach((download) => {
      // Count by category
      stats.downloadsByCategory[download.art.category] = 
        (stats.downloadsByCategory[download.art.category] || 0) + 1;

      // Count by type
      stats.downloadsByType[download.art.type] = 
        (stats.downloadsByType[download.art.type] || 0) + 1;
    });

    return stats;
  }
} 