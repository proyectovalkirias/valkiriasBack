import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];
    console.log('Token en Guard:', token);
    if (!token) throw new ForbiddenException('Debes iniciar sesión');
    try {
      const secret = process.env.JWT_KEY_SECRET;
      const payload = this.jwtService.verify(token, { secret });

      payload.exp = new Date(payload.exp * 1000);
      payload.iat = new Date(payload.iat * 1000);

      payload.user = {
        ...payload,
        role: payload.role,
      };
      console.log('PAYLOAD');
      console.log(payload);

      request.user = payload;

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }
      throw new UnauthorizedException('Token inválido');
    }
  }
}