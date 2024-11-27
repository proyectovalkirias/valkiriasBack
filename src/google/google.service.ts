import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class GoogleService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async googleLogin(req) {
    if (!req.user) throw new NotFoundException('No user from Google');

    let user = await this.userRepository.getUserByEmail(req.user.email);

    if (!user) {
      user = await this.userRepository.createUser({
        email: req.user.email,
        firstname: req.user.givenName,
        lastname: req.user.familyName,
        photo: req.user.picture,
        googleAccessToken: req.user.accessToken,
      });

      const payload = { email: user.email, sub: user.id };
      const jwt = this.jwtService.sign(payload);

      return {
        user,
        token: jwt,
      };
    }
  }
}
