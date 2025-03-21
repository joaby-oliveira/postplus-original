import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ArtType, ArtCategory } from './create-art.dto';

export class QueryArtDto {
  @ApiProperty({ enum: ArtType, required: false })
  @IsEnum(ArtType)
  @IsOptional()
  type?: ArtType;

  @ApiProperty({ enum: ArtCategory, required: false })
  @IsEnum(ArtCategory)
  @IsOptional()
  category?: ArtCategory;
} 