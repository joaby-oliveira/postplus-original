import { ApiProperty } from '@nestjs/swagger';

export class UploadLogoResponseDto {
  @ApiProperty({ example: 'https://s3.localhost.localstack.cloud:4566/bucket-name/company-123/logo.jpg' })
  logoUrl: string;
} 