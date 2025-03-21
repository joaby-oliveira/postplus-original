import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'sua-chave-secreta-aqui',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
})); 