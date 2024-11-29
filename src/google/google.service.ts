import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class GoogleService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async googleLogin(user: any) {

    const { email, firstname, lastname, photo } = user;

        // if (!user) throw new NotFoundException('No user from Google');

    let dbuser = await this.userRepository.getUserByEmail(email);

    if (!dbuser) {
      user = await this.userRepository.createUser({
        email,
        firstname,
        lastname,
        photo,
      
      });

      const payload = { email: dbuser.email, sub: dbuser.id };
      const token = this.jwtService.sign(payload);

      return { user: dbuser, token };
    }
  }
}
