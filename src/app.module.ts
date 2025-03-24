import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArtsModule } from './arts/arts.module';
import { AuthModule } from './auth/auth.module';
import awsConfig from './config/aws.config';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
      isGlobal: true,
    }),
    ArtsModule,
    CompanyModule,
    AuthModule,
  ],
})
export class AppModule {}