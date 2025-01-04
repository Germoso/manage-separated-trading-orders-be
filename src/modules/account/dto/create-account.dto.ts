import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    example: 'MONGO_ID',
    description: 'El id del usuario',
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 100,
    description: 'El balance de la cuenta',
  })
  @IsNotEmpty()
  @IsNumber()
  balance: number;
}
