import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from 'class-validator';

export class UserDto {
	@ApiProperty({ example: '093e53ca-7c70-45f6-841c-39e0b9c956c0', description: 'UUID del Usuario' })
	@IsNotEmpty()
	@IsString()
	userId: string = '';

	@ApiProperty({ example: '123156156', description: 'Id de la Pelicula' })
	@IsString()
	@IsNotEmpty()
	movieId: string = '';
}
