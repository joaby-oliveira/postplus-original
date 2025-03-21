import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { QueryArtDto } from './dto/query-art.dto';

@Injectable()
export class ArtsService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async create(createArtDto: CreateArtDto) {
    return this.prisma.art.create({
      data: createArtDto,
    });
  }

  async findAll(query: QueryArtDto) {
    const where = {
      ...(query.type && { type: query.type }),
      ...(query.category && { category: query.category }),
    };

    return this.prisma.art.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const art = await this.prisma.art.findUnique({
      where: { id },
    });

    if (!art) {
      throw new NotFoundException(`Art with ID ${id} not found`);
    }

    return art;
  }

  async update(id: string, updateArtDto: UpdateArtDto) {
    await this.findOne(id); // Verify existence

    return this.prisma.art.update({
      where: { id },
      data: updateArtDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verify existence

    return this.prisma.art.delete({
      where: { id },
    });
  }

  async uploadArtFiles(
    id: string,
    files: { [key: string]: Express.Multer.File },
  ) {
    const art = await this.findOne(id);
    const formats: Record<string, string> = {};

    for (const [key, file] of Object.entries(files)) {
      const s3Key = `arts/${id}/${key}-${Date.now()}-${file.originalname}`;
      const url = await this.s3Service.uploadFile(file, s3Key);
      formats[key] = url;
    }

    return this.prisma.art.update({
      where: { id },
      data: {
        formats: formats,
      },
    });
  }

  async downloadArt(artId: string, companyId: string) {
    const art = await this.findOne(artId);

    // Record the download
    await this.prisma.download.create({
      data: {
        artId,
        companyId,
      },
    });

    return art;
  }
} 