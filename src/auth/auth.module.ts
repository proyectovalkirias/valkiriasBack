import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryConfig, CloudinaryService } from 'src/config/cloudinary';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, UserRepository, CloudinaryService, CloudinaryConfig],
  controllers: [AuthController],
})
export class AuthModule {}
