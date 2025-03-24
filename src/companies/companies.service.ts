import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { S3 } from 'aws-sdk';
import { UploadLogoResponseDto } from './dto/upload-logo.dto';

@Injectable()
export class CompaniesService {
  private readonly s3: S3;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.s3 = new S3({
      endpoint: 'http://localstack:4566',
      s3ForcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
      region: this.configService.get('AWS_REGION', 'us-east-1'),
    });
  }

  async uploadLogo(
    companyId: string,
    file: Express.Multer.File,
  ): Promise<UploadLogoResponseDto> {
    console.log('uploadLogo');
    // Check if company exists
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Get bucket name from environment variables
    const bucket = this.configService.getOrThrow('S3_BUCKET');
    if (!bucket) {
      throw new Error('S3_BUCKET environment variable is not configured');
    }

    const fileKey = `companies/${companyId}/logo-${Date.now()}${this.getFileExtension(file.originalname)}`;

    console.log(fileKey);
    console.log({bucket});
    // Upload to S3
    await this.s3
      .putObject({
        Bucket: 'test-bucket',
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();

    // Generate the URL
    const logoUrl = `http://localhost:4566/${bucket}/${fileKey}`;

    // Update company with new logo URL
    await this.prisma.company.update({
      where: { id: companyId },
      data: { logoUrl },
    });

    return { logoUrl };
  }

  private getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.'));
  }
} 