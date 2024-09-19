import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Favorite {
	@PrimaryGeneratedColumn('uuid')
	id?: string;

	@Column({nullable: false})
	movieId?: string;

	@ManyToOne(() => User)
	user?: User;

}