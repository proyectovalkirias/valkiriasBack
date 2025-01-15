import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './user.repository';
import { CloudinaryConfig, CloudinaryService } from 'src/config/cloudinary';
import { GeocodingModule } from 'src/geocoding/geocoding.module';
import { Address } from 'src/entities/address.entity';
import { Order } from 'src/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Order]),
   GeocodingModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, CloudinaryService, CloudinaryConfig],
  exports: [UserService, UserRepository],
})
export class UserModule {}
