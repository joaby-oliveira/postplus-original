import { 
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiConsumes, 
  ApiOperation, 
  ApiResponse,
  ApiBody 
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { UploadLogoResponseDto } from './dto/upload-logo.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post(':id/logo')
  @ApiOperation({ summary: 'Upload company logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Company logo image file (JPG, PNG, or WEBP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Logo uploaded successfully',
    type: UploadLogoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<UploadLogoResponseDto> {
    console.log('uploadLogo teste zinho aiai ai');
    return {
      logoUrl: 'https://test-bucket.s3.localstack.cloud:4566/companies/1/logo-1716534000000.jpg',
    };
    // return this.companiesService.uploadLogo(id, file);
  }
} 