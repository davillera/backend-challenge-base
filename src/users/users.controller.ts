import { Controller, Post, Get, Put, Param, Delete, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Public } from "../decorators/public.decorator";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(
		private usersService: UsersService
	) { }

  @Public()
  @ApiOperation({ summary: "Crear un nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario creado exitosamente." })
  @ApiResponse({ status: 409, description: "El email ya está en uso." })
  @Post("register")
  async create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión" })
  @ApiResponse({ status: 200, description: "Inicio de sesión exitoso." })
  @ApiResponse({ status: 401, description: "Credenciales incorrectas." })
  @ApiBody({
    description: "Email y contraseña para iniciar sesión",
    required: true,
    schema: {
      type: "object",
      properties: {
        email: { type: "string", example: "user@example.com" },
        password: { type: "string", example: "password123" },
      },
    },
  })
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.usersService.login(email, password);
  }

  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: "Obtener usuarios no eliminados" })
  @ApiResponse({ status: 200, description: "Lista de usuarios no eliminados." })
  async getAllUsersNotDeleted() {
    return this.usersService.findAllNotDeleted();
  }

  @ApiBearerAuth('JWT-auth')
  @Get("deleted")
  @ApiOperation({ summary: "Obtener usuarios eliminados" })
  @ApiResponse({ status: 200, description: "Lista de usuarios eliminados." })
  async getDeletedUsers() {
    return this.usersService.findAllDelete();
  }

  @ApiBearerAuth('JWT-auth')
  @Get("allUsers")
  @ApiOperation({ summary: "Obtener todos los usuarios" })
  @ApiResponse({ status: 200, description: "Lista de todos los usuarios (incluyendo eliminados)." })
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth('JWT-auth')
  @Get(":id")
  @ApiOperation({ summary: "Obtener un usuario por ID" })
  @ApiResponse({ status: 200, description: "Usuario encontrado." })
  @ApiResponse({ status: 404, description: "Usuario no encontrado." })
  @ApiParam({ name: "id", description: "ID del usuario", example: "1234" })
  async getUserById(@Param("id") id: string) {
    return this.usersService.findOneById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(":id")
  @ApiOperation({ summary: "Actualizar usuario" })
  @ApiResponse({ status: 200, description: "Usuario actualizado correctamente." })
  @ApiResponse({ status: 404, description: "Usuario no encontrado." })
  @ApiParam({ name: "id", description: "ID del usuario", example: "1234" })
  @ApiBody({ description: "Datos para actualizar el usuario", type: UserDto })
  async updateUser(@Param("id") id: string, @Body() updateUserDto: Partial<UserDto>) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un usuario (Soft Delete)" })
  @ApiResponse({ status: 200, description: "Usuario marcado como eliminado." })
  @ApiResponse({ status: 404, description: "Usuario no encontrado." })
  @ApiParam({ name: "id", description: "ID del usuario", example: "1234" })
  async softDeleteUser(@Param("id") id: string) {
    return this.usersService.delete(id);
  }
}
