import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull, Not } from "typeorm";
import { User } from "./user.entity";
import type { UserDto } from "./dto/user.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  private readonly jwtSecret: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definido en el .env");
    }
    this.jwtSecret = process.env.JWT_SECRET;
  }

  async create(createUserDto: UserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException("El email ya está en uso");
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException("Credenciales incorrectas");
    }
    if (user.deletedAt) {
      throw new UnauthorizedException("Usuario Eliminado");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales incorrectas");
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: "1h" });

    return { accessToken, userId: user.id };
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    return user;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findAllNotDeleted() {
    return this.userRepository.find({ where: { deletedAt: IsNull() } });
  }

  async findAllDelete() {
    return this.userRepository.find({ where: { deletedAt: Not(IsNull()) } });
  }

  async update(id: string, updateUserDto: Partial<UserDto>) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    if (updateUserDto.password) {
      const hashedPassword = await this.hashPassword(updateUserDto.password);
      user.password = hashedPassword;
    }

    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    user.deletedAt = new Date();
    await this.userRepository.save(user);
  }
}
