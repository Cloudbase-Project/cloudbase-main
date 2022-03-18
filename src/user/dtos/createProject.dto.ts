import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class createProjectDTO {
  @IsString()
  @ApiProperty({ required: true })
  name: string;
}
