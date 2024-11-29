import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ): Promise<any> {
    console.log('Google profile:', profile);
    console.log('Access token:', accessToken);
    try {
      if(!profile){
        return 'Perfil no encontrado'
      }
        
      const { name, emails, photos } = profile;
  
      const user = {
        email: emails[0].value,
        firstname: name?.givenName,
        lastname: name?.familyName,
        photo: photos?.[0].value,
        accessToken,
      };
  
      console.log('Datos de usuario:', user);
  
      done(null, user);
    } catch (error) {
      console.error('Error en GoogleStrategy validate:', error);
      done(error, null);
    }

  }
}
