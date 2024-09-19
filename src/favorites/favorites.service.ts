import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {Favorite} from "./favorite.entity";
import {Repository} from "typeorm";

@Injectable()
export class FavoritesService {

	constructor(
		@InjectRepository(Favorite)
		private favoriteRepository: Repository<Favorite>,

	) {}

	async addFavorite(userId: string, movieId: string) {
		const user = await this.favoriteRepository.findOne({ where: { id: userId } });

		if (!user) {
			throw new Error('Usuario no encontrado');
		}

		const existingFavorite = await this.favoriteRepository.findOne({ where: { user: user, movieId } });

		if (existingFavorite) {
			throw new Error('Ya está añadida a Favoritos');
		}

		const favorite = this.favoriteRepository.create({ movieId, user });
		return this.favoriteRepository.save(favorite);
	}

	async getFavorites(userId: string) {
		return this.favoriteRepository.find({
			where: { user: { id: userId } },
			relations: ['user'],
		});
	}


	async removeFavorite(userId: string, movieId: string) {
		const user = await this.favoriteRepository.findOne({ where: { id: userId } });

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
