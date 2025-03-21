import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'empresa@exemplo.com', description: 'Email da empresa' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha da empresa' })
  @IsString()
  @MinLength(6)
  password: string;
} 