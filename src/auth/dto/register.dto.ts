import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Empresa Exemplo', description: 'Nome da empresa' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'empresa@exemplo.com', description: 'Email da empresa' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha da empresa' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '12345678900', description: 'CNPJ da empresa' })
  @IsString()
  cnpj: string;

  @ApiProperty({ example: 'Rua Exemplo, 123', description: 'Endereço da empresa' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade da empresa' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'SP', description: 'Estado da empresa' })
  @IsString()
  state: string;

  @ApiProperty({ example: '01234567', description: 'CEP da empresa' })
  @IsString()
  zipCode: string;

  @ApiProperty({ example: '+5511999999999', description: 'WhatsApp da empresa' })
  @IsPhoneNumber()
  whatsapp: string;
} 