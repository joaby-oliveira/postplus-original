import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArtsService } from './arts.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { QueryArtDto } from './dto/query-art.dto';
import { GetCompany } from '../auth/get-company.decorator';

@ApiTags('Artes')
@Controller('arts')
@ApiBearerAuth()
export class ArtsController {
  constructor(private readonly artsService: ArtsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Criar nova arte',
    description: 'Cria uma nova arte no sistema. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Arte criada com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Feliz Natal',
        description: 'Arte natalina para Instagram',
        type: 'FEED',
        category: 'CHRISTMAS',
        formats: {
          story: 'https://s3.amazonaws.com/bucket/story.jpg',
          feed: 'https://s3.amazonaws.com/bucket/feed.jpg',
          thumbnail: 'https://s3.amazonaws.com/bucket/thumbnail.jpg'
        },
        createdAt: '2024-03-20T00:00:00.000Z',
        updatedAt: '2024-03-20T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Body() createArtDto: CreateArtDto) {
    return this.artsService.create(createArtDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Listar artes',
    description: 'Retorna uma lista de artes com filtros opcionais por tipo e categoria. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de artes retornada com sucesso',
    schema: {
      example: [{
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Feliz Natal',
        description: 'Arte natalina para Instagram',
        type: 'FEED',
        category: 'CHRISTMAS',
        formats: {
          story: 'https://s3.amazonaws.com/bucket/story.jpg',
          feed: 'https://s3.amazonaws.com/bucket/feed.jpg',
          thumbnail: 'https://s3.amazonaws.com/bucket/thumbnail.jpg'
        }
      }]
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(@Query() query: QueryArtDto) {
    return this.artsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Buscar arte específica',
    description: 'Retorna os detalhes de uma arte específica pelo ID. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Arte encontrada com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Feliz Natal',
        description: 'Arte natalina para Instagram',
        type: 'FEED',
        category: 'CHRISTMAS',
        formats: {
          story: 'https://s3.amazonaws.com/bucket/story.jpg',
          feed: 'https://s3.amazonaws.com/bucket/feed.jpg',
          thumbnail: 'https://s3.amazonaws.com/bucket/thumbnail.jpg'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Arte não encontrada' })
  findOne(@Param('id') id: string) {
    return this.artsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Atualizar arte',
    description: 'Atualiza os dados de uma arte existente. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Arte atualizada com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Feliz Natal 2024',
        description: 'Arte natalina atualizada para Instagram',
        type: 'FEED',
        category: 'CHRISTMAS',
        formats: {
          story: 'https://s3.amazonaws.com/bucket/story.jpg',
          feed: 'https://s3.amazonaws.com/bucket/feed.jpg',
          thumbnail: 'https://s3.amazonaws.com/bucket/thumbnail.jpg'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Arte não encontrada' })
  update(@Param('id') id: string, @Body() updateArtDto: UpdateArtDto) {
    return this.artsService.update(id, updateArtDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Excluir arte',
    description: 'Remove uma arte do sistema. Requer autenticação.'
  })
  @ApiResponse({ status: 200, description: 'Arte excluída com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Arte não encontrada' })
  remove(@Param('id') id: string) {
    return this.artsService.remove(id);
  }

  @Post(':id/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'story', maxCount: 1 },
      { name: 'feed', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ 
    summary: 'Upload de arquivos da arte',
    description: 'Faz upload dos arquivos de imagem da arte (story, feed e thumbnail). Requer autenticação.'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        story: {
          type: 'string',
          format: 'binary',
          description: 'Imagem para Instagram Stories'
        },
        feed: {
          type: 'string',
          format: 'binary',
          description: 'Imagem para Instagram Feed'
        },
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'Imagem thumbnail'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Arquivos atualizados com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        formats: {
          story: 'https://s3.amazonaws.com/bucket/story.jpg',
          feed: 'https://s3.amazonaws.com/bucket/feed.jpg',
          thumbnail: 'https://s3.amazonaws.com/bucket/thumbnail.jpg'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Arte não encontrada' })
  uploadFiles(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      story?: Express.Multer.File[];
      feed?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
  ) {
    const fileMap: { [key: string]: Express.Multer.File } = {};
    for (const [key, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray[0]) {
        fileMap[key] = fileArray[0];
      }
    }
    return this.artsService.uploadArtFiles(id, fileMap);
  }

  @Post(':id/download')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Download de arte',
    description: 'Registra o download de uma arte por uma empresa. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 200, 
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
          formats: {
            story: 'https://s3.amazonaws.com/bucket/story.jpg',
            feed: 'https://s3.amazonaws.com/bucket/feed.jpg'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Arte não encontrada' })
  downloadArt(
    @Param('id') id: string,
    @GetCompany() company: { id: string },
  ) {
    return this.artsService.downloadArt(id, company.id);
  }
} 