import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import {User} from "../users/user.entity";

@Entity()
export class Favorite {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	movieId?: string;

	@ManyToOne(() => User, (user) => user.favorites)
	user?: User;
}
