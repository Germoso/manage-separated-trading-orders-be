import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'Jhon',
    description: 'El nombre del usuario',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Password123*',
    description: 'La contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;
}
