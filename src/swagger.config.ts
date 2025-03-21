import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('PostPlus API')
  .setDescription(`
    API para gerenciamento de artes para redes sociais.
    
    ## Funcionalidades Principais:
    - Cadastro e autenticação de empresas
    - Upload de logos
    - Download de artes para Instagram (feed e stories)
    - Rastreamento de downloads
    - Estatísticas de uso
    
    ## Como Usar:
    1. Crie uma conta de empresa
    2. Faça login para obter o token JWT
    3. Use o token no header 'Authorization: Bearer <token>' para acessar os endpoints protegidos
  `)
  .setVersion('1.0')
  .addBearerAuth()
  .build(); 