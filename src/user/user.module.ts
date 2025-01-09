import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './user.repository';
import { CloudinaryConfig, CloudinaryService } from 'src/config/cloudinary';
import { GeocodingModule } from 'src/geocoding/geocoding.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), GeocodingModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, CloudinaryService, CloudinaryConfig],
  exports: [UserService, UserRepository],
})
export class UserModule {}
