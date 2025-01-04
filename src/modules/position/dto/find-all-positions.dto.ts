import { ApiProperty } from '@nestjs/swagger';
import { PositionStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class FindAllPositionsDto {
  @ApiProperty({
    example: PositionStatus.CLOSED,
    description: 'Position status',
    required: false,
  })
  @IsEnum(PositionStatus)
  @IsOptional()
  positionStatus?: PositionStatus;
}
