import { ApiProperty } from '@nestjs/swagger';
import { PositionStatus } from '@prisma/client';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Min } from 'class-validator';

export class FindAllPositionsDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'El ID de la cuenta',
  })
  @IsEnum(PositionStatus)
  @IsOptional()
  positionStatus?: PositionStatus;
}
