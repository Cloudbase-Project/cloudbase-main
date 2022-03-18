import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ServiceList } from '../types/ServiceList';

export class toggleServiceDTO {
  @IsEnum(ServiceList)
  @ApiProperty({ required: true })
  serviceName: ServiceList;
}
