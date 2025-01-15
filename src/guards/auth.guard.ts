import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthGuard implements CanActivate {
  private googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No se proporcionó un token');
    }

    // Verificar si el token es un JWT
    if (token.startsWith('eyJ') && token.length > 100) { // JWT tiene un formato específico
      return this.verifyJwtToken(token, request);
    }

    // De lo contrario, consideramos que es un token de Google
    return this.verifyGoogleToken(token, request);
  }

  // Verificación de token JWT
  private async verifyJwtToken(token: string, request: any): Promise<boolean> {
    try {
      const secret = process.env.JWT_KEY_SECRET;
      const payload = this.jwtService.verify(token, { secret });

      payload.exp = new Date(payload.exp * 1000);
      payload.iat = new Date(payload.iat * 1000);

      payload.user = {
        ...payload,
        role: payload.role,
      };

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token de sesión inválido');
    }
  }

  private async verifyGoogleToken(accessToken: string, request: any): Promise<boolean> {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
      const payload = response.data;

      request.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        photo: payload.picture,
        roles: ['google-user'],
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token de Google no válido');
    }
  }
}
