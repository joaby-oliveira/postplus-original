import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const company = await this.prisma.company.findUnique({
      where: { email: loginDto.email },
    });

    if (!company) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, company.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: company.id, email: company.email };
    return {
      access_token: this.jwtService.sign(payload),
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingCompany = await this.prisma.company.findUnique({
      where: { email: registerDto.email },
    });

    if (existingCompany) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const { password, ...companyData } = registerDto;
    const company = await this.prisma.company.create({
      data: {
        ...companyData,
        password: hashedPassword,
      },
    });

    const payload = { sub: company.id, email: company.email };
    return {
      access_token: this.jwtService.sign(payload),
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
      },
    };
  }
} 