import { PartialType } from '@nestjs/swagger';
import { CreateArtDto } from './create-art.dto';

export class UpdateArtDto extends PartialType(CreateArtDto) {} 