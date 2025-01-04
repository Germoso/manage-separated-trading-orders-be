import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateTickerDto {
  @ApiProperty({
    example: 'AAPL',
    description: 'The symbol of the ticker',
  })
  @IsString()
  @IsNotEmpty()
  symbol: string;
}
