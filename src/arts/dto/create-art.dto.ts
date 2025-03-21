import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNotEmpty, IsObject } from 'class-validator';

export enum ArtType {
  STORY = 'STORY',
  FEED = 'FEED',
}

export enum ArtCategory {
  CHRISTMAS = 'CHRISTMAS',
  NEW_YEAR = 'NEW_YEAR',
  EASTER = 'EASTER',
  MOTHERS_DAY = 'MOTHERS_DAY',
  FATHERS_DAY = 'FATHERS_DAY',
  BLACK_FRIDAY = 'BLACK_FRIDAY',
}

export class CreateArtDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ArtType })
  @IsEnum(ArtType)
  type: ArtType;

  @ApiProperty({ enum: ArtCategory })
  @IsEnum(ArtCategory)
  category: ArtCategory;

  @ApiProperty({
    example: {
      story: 'https://s3-url/story.jpg',
      feed: 'https://s3-url/feed.jpg',
      thumbnail: 'https://s3-url/thumbnail.jpg',
    },
  })
  @IsObject()
  formats: Record<string, string>;
} 