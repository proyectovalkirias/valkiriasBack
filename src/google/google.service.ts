import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class GoogleService {
  constructor(
    // private readonly jwtService: JwtService,
    // private readonly userRepository: UserRepository,
  ) {}

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
}

