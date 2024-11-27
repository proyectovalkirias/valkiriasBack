import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [GoogleService, UserRepository],
  controllers: [GoogleController]

})
export class GoogleModule {}
