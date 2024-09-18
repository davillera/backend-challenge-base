import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  override handleRequest(err: any, user: any, info: { name: string }) {
    if (err || !user) {
      if (info?.name === "TokenExpiredError") {
        throw new UnauthorizedException("El token ha expirado");
      } else if (info?.name === "JsonWebTokenError") {
        throw new UnauthorizedException("El token es inválido");
      } else {
        throw new UnauthorizedException("No se ha proporcionado un token válido");
      }
    }
    return user;
  }
}
