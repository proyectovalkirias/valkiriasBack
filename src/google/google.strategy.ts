import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GoogleStrategy {
  constructor(private readonly configService: ConfigService) {}

  async getGoogleToken(authCode: string): Promise<any> {
    const clientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = this.configService.get<string>('GOOGLE_CALLBACK_URL');

    try {
      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        code: authCode,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: callbackURL,
        grant_type: 'authorization_code',
      });

      return data;
    } catch (error) {
      console.error('Error al obtener token de Google', error);
      throw new BadRequestException('Error obteniendo el token de Google');
    }
  }

  async getGoogleProfile(access_token: string): Promise<any> {
    try {
      const { data } = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      return data;
    } catch (error) {
      console.error('Error obteniendo el perfin de Google:', error);
      throw new BadGatewayException('Error obteniendo el perfil de Google');
    }
  }
}
