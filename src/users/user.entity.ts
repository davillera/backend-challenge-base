import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {Favorite} from "../favorites/favorite.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ unique: true })
  email?: string;

  @Column()
  password?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date = new Date();

  @Column({ type: "timestamp", nullable: true })
  deletedAt?: Date;

	@OneToMany(() => Favorite, (favorite) => favorite.user)
	favorites?: Favorite[];
}
