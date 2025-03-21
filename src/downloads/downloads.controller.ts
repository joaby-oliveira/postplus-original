import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DownloadsService } from './downloads.service';
import { CreateDownloadDto } from './dto/create-download.dto';
import { GetCompany } from '../auth/get-company.decorator';

@ApiTags('Downloads')
@Controller('downloads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Registrar download',
    description: 'Registra um novo download de arte por uma empresa. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Download registrado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        artId: '123e4567-e89b-12d3-a456-426614174001',
        companyId: '123e4567-e89b-12d3-a456-426614174002',
        createdAt: '2024-03-20T00:00:00.000Z',
        art: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'Feliz Natal',
          description: 'Arte natalina para Instagram',
          type: 'FEED',
          category: 'CHRISTMAS',
          formats: {
            story: 'https://s3.amazonaws.com/bucket/story.jpg',
            feed: 'https://s3.amazonaws.com/bucket/feed.jpg'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Arte não encontrada' })
  create(
    @Body() createDownloadDto: CreateDownloadDto,
    @GetCompany() company: { id: string },
  ) {
    return this.downloadsService.create(createDownloadDto, company.id);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar downloads',
    description: 'Retorna uma lista de todos os downloads realizados pela empresa. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de downloads retornada com sucesso',
    schema: {
      example: [{
        id: '123e4567-e89b-12d3-a456-426614174000',
        artId: '123e4567-e89b-12d3-a456-426614174001',
        companyId: '123e4567-e89b-12d3-a456-426614174002',
        createdAt: '2024-03-20T00:00:00.000Z',
        art: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'Feliz Natal',
          type: 'FEED',
          category: 'CHRISTMAS',
          formats: {
            story: 'https://s3.amazonaws.com/bucket/story.jpg',
            feed: 'https://s3.amazonaws.com/bucket/feed.jpg'
          }
        }
      }]
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(@GetCompany() company: { id: string }) {
    return this.downloadsService.findAll(company.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar download específico',
    description: 'Retorna os detalhes de um download específico. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Download encontrado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        artId: '123e4567-e89b-12d3-a456-426614174001',
        companyId: '123e4567-e89b-12d3-a456-426614174002',
        createdAt: '2024-03-20T00:00:00.000Z',
        art: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'Feliz Natal',
          type: 'FEED',
          category: 'CHRISTMAS',
          formats: {
            story: 'https://s3.amazonaws.com/bucket/story.jpg',
            feed: 'https://s3.amazonaws.com/bucket/feed.jpg'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Download não encontrado' })
  findOne(
    @Param('id') id: string,
    @GetCompany() company: { id: string },
  ) {
    return this.downloadsService.findOne(id, company.id);
  }

  @Get('stats/summary')
  @ApiOperation({ 
    summary: 'Estatísticas de downloads',
    description: 'Retorna estatísticas dos downloads realizados pela empresa, incluindo total e distribuição por categoria e tipo. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      example: {
        totalDownloads: 10,
        downloadsByCategory: {
          'CHRISTMAS': 5,
          'NEW_YEAR': 3,
          'EASTER': 2
        },
        downloadsByType: {
          'FEED': 7,
          'STORY': 3
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  getDownloadStats(@GetCompany() company: { id: string }) {
    return this.downloadsService.getDownloadStats(company.id);
  }
} 