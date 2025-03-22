FROM node:18-slim

WORKDIR /usr/src/app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y openssl netcat-traditional procps

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências, incluindo dependências de desenvolvimento
RUN npm install

# Copiar o restante do código
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

EXPOSE 3000

# Script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]  # ou use start:dev para ambiente de desenvolvimento
