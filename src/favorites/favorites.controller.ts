import {Controller, Post, Body, Delete, Get} from '@nestjs/common';
import {FavoritesService} from "./favorites.service";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";
import {UserDto} from "./dto/favorite.dto";


@ApiBearerAuth('JWT-auth')
@ApiTags("favorites")
@Controller('favorites')
export class FavoritesController {

	constructor(
		private favoriteService: FavoritesService
	) { }


	@Post()
	@ApiOperation({ summary: 'Añadir película a favoritos' })
	@ApiBody({ type: UserDto })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				movieId: { type: 'string', description: 'ID de la película' },
				userId: { type: 'string', description: 'ID del usuario' },
			},
			required: ['movieId', 'userId'],
		},
	})
	async addFavorite(@Body() userDto: UserDto) {
		const { movieId, userId } = userDto;
		return this.favoriteService.addFavorite(userId, movieId);
	}

	@Get()
	@ApiOperation({ summary: 'Obtener las películas favoritas de un usuario' })
	@ApiQuery({
		name: 'userId',
		type: 'string',
		description: 'ID del usuario',
		required: true,
	})
	async getFavorites(@Body() body: { userId: string }) {
		const { userId } = body;
		return this.favoriteService.getFavorites(userId);
	}


	@Delete()
	@ApiOperation({ summary: 'Eliminar película de favoritos' })
	@ApiBody({ type: UserDto })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				movieId: { type: 'string', description: 'ID de la película' },
				userId: { type: 'string', description: 'ID del usuario' },
			},
			required: ['movieId', 'userId'],
		},
	})
	async removeFavorite(@Body() userDto: UserDto) {
		const { movieId, userId } = userDto;
		return this.favoriteService.removeFavorite(userId, movieId);
	}
}
