import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import axios from 'axios';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class GoogleService {
  constructor( private readonly userRepository: UserRepository) {} 

  async getGoogleAuthToken(code: string) {
    try {
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL,
          grant_type: 'authorization_code',
        },
      );

      return tokenResponse.data.access_token;
    } catch (error) {
      throw new BadRequestException('Error  retrieving Google token');
    }
  }

  async getUserInfo(access_token: string) {
    try {
      const userinfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      return userinfo.data;
    } catch (error) {
      console.error(
        'Error retrieving user info from Google:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Error retrieving user info from Google');
    }
  }

  async handleGoogleAuth(code: string){
    try {
      const accessToken = await this.getGoogleAuthToken(code);

      const userInfo = await this.getUserInfo(accessToken);

      let user = await this.userRepository.getUserByEmail(userInfo.email);
      if(!user) {
        user = await this.userRepository.createUser({
          firstname: userInfo.given_name || '',
          lastname: userInfo.family_name || '',
          email: userInfo.email,
          googleAccessToken: accessToken,
          photo: userInfo.picture || '',
        });
      } else {
        user.googleAccessToken = accessToken;
        user.photo = userInfo.picture;
        await this.userRepository.userUpdate(user.id, user);
      }
      return user;

    } catch (error) {
      throw new BadRequestException('Error handling Google Auth')
    }
  }

  async revokeGoogleToken(token: string) {
    try {
      const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${token}`;
      await axios.post(revokeUrl);

    } catch (error) {
      console.log('Error revoking Google Token:', error.response?.data || error.message);
      throw new BadRequestException('Error revoking Google Token')
    }
  }
}
