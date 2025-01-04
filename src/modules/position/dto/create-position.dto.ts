import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, IsStrongPassword, Min } from 'class-validator';

export class CreatePositionDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'El ID de la cuenta',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  accountId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'El ID del ticker',
  })
  @IsNotEmpty()
  @IsMongoId()
  tickerId: string;

  @ApiProperty({
    example: 100,
    description: 'La cantidad de la posición',
  })
  @Min(0)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    example: 150.5,
    description: 'El precio de apertura de la posición',
  })
  @Min(0)
  @IsNotEmpty()
  price: number;
}
