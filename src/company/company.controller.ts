import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Empresas')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar nova empresa',
    description: 'Cria uma nova conta de empresa no sistema. O email deve ser único.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Empresa criada com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Empresa Exemplo',
        email: 'contato@empresaexemplo.com',
        whatsapp: '5511999999999',
        street: 'Rua Exemplo, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
        logoUrl: null,
        createdAt: '2024-03-20T00:00:00.000Z',
        updatedAt: '2024-03-20T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Listar todas as empresas',
    description: 'Retorna uma lista de todas as empresas cadastradas. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de empresas retornada com sucesso',
    schema: {
      example: [{
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Empresa Exemplo',
        email: 'contato@empresaexemplo.com',
        whatsapp: '5511999999999',
        street: 'Rua Exemplo, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
        logoUrl: 'https://s3.amazonaws.com/bucket/logo.jpg'
      }]
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Buscar empresa específica',
    description: 'Retorna os detalhes de uma empresa específica pelo ID. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Empresa encontrada com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Empresa Exemplo',
        email: 'contato@empresaexemplo.com',
        whatsapp: '5511999999999',
        street: 'Rua Exemplo, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
        logoUrl: 'https://s3.amazonaws.com/bucket/logo.jpg'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Atualizar empresa',
    description: 'Atualiza os dados de uma empresa existente. Requer autenticação.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Empresa atualizada com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Empresa Atualizada',
        email: 'novo@empresaexemplo.com',
        whatsapp: '5511999999999',
        street: 'Nova Rua, 456',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
        logoUrl: 'https://s3.amazonaws.com/bucket/logo.jpg'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Excluir empresa',
    description: 'Remove uma empresa do sistema. Requer autenticação.'
  })
  @ApiResponse({ status: 200, description: 'Empresa excluída com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @Post(':id/logo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Upload de logo',
    description: 'Faz upload da logo da empresa. Requer autenticação. Aceita imagens em formato JPG, PNG ou SVG.'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem da logo'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Logo atualizada com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        logoUrl: 'https://s3.amazonaws.com/bucket/logo.jpg'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('uploadLogo company');
    return this.companyService.uploadLogo(id, file);
  }
} 