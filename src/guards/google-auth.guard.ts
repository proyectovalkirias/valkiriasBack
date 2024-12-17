import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthGuard implements CanActivate {
  private googleClient: OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if(!token) {
      throw new UnauthorizedException('No se proporcionó un token de Google');
    }

    try {
      const payload = await this.verifyGoogleToken(token);

      request.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        photo: payload.picture,
        roles: ['google-user'],
      };

      return true;

    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  private async verifyGoogleToken(token: string): Promise<any> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  }
}
