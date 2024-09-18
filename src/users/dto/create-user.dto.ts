import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @ApiProperty({ example: 'password', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  password: string = '';
}
