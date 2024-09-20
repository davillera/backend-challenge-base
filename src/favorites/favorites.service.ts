import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {Favorite} from "./favorite.entity";
import {Repository} from "typeorm";

@Injectable()
export class FavoritesService {

	constructor(
		@InjectRepository(Favorite)
		private favoriteRepository: Repository<Favorite>,
		@InjectRepository(User)
		private userRepository: Repository<User>,

	) {}

	async addFavorite(userId: string, movieId: string) {
		const user = await this.userRepository.findOne({ where: { id: userId } });

		if (!user) {
			throw new NotFoundException("Usuario no encontrado")
		}

		const existingFavorite = await this.favoriteRepository.findOne({ where: { user: user, movieId } });

		if (existingFavorite) {
			throw new ConflictException("Ya está añadido a Favoritos")
		}

		const favorite = this.favoriteRepository.create({ movieId, user });
		await this.favoriteRepository.save(favorite);
		return {
			message: 'Película añadida a favoritos exitosamente',
			userid: user,
			movieId: favorite.movieId,
		};
	}

	async getFavorites(userId: string) {
		const favorites = await this.favoriteRepository.find({
			where: { user: { id: userId } },
		});

		if (!favorites.length) {
			throw new NotFoundException("no se encontraron Favoritos")
		}

		return favorites;
	}



	async removeFavorite(userId: string, movieId: string) {
		const user = await this.userRepository.findOne({ where: { id: userId } });

		if (!user) {
			throw new Error('Usuario no encontrado');
		}

		const favorite = await this.favoriteRepository.findOne({
			where: { user: user, movieId },
		});

		if (!favorite) {
			throw new Error('Favorito no encontrado');
		}

		await this.favoriteRepository.remove(favorite);
	}
}
