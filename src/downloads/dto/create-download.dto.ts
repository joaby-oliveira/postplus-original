import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDownloadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  artId: string;
} 