import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
}
