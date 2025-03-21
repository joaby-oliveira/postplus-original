import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Empresa Exemplo', description: 'Nome da empresa' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'empresa@exemplo.com', description: 'Email da empresa' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha da empresa' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '12345678900', description: 'CNPJ da empresa' })
  @IsString()
  cnpj: string;

  @ApiProperty({ example: '+5511999999999', description: 'WhatsApp da empresa' })
  @IsPhoneNumber()
  @IsNotEmpty()
  whatsapp: string;

  @ApiProperty({ example: 'Rua Exemplo, 123', description: 'Endereço da empresa' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade da empresa' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'SP', description: 'Estado da empresa' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '01234567', description: 'CEP da empresa' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;
} 