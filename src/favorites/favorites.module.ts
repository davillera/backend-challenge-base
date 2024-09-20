import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorite } from "./favorite.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([Favorite]),
		UsersModule
	],
  providers: [FavoritesService],
  controllers: [FavoritesController],
	exports: [FavoritesService]
})
export class FavoritesModule {}
