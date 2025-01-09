import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/dtos/userDto';
import { UpdateUserDto } from 'src/dtos/updateUserDto';
import { transporter } from 'src/config/mailer';
import { registerMail } from 'src/mails/registerMail';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import { Address } from 'src/entities/address.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository,
              private readonly geoCodingService: GeocodingService){}

  async getAllUser() {
    const users = await this.userRepository.getAllUser();
    const userWithoutPass = users.map(
      ({ password, ...userWithoutPass }) => userWithoutPass,
    );
    return userWithoutPass;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException('User not found');

    const { password, ...userWithoutPass } = user;

    return userWithoutPass;
  }

  async getUserByEmail(email: string): Promise<Partial<User>> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const { password, ...userWithoutPass } = user;

    return userWithoutPass;
  }

  async createUser(userData: UserDto) {
    try {
      const newUser = await this.userRepository.createUser(userData);
      const { password, ...userWithoutPass } = newUser;

      return userWithoutPass;
    } catch (error) {
      throw new BadRequestException('Error creating user');
    }
  }

  async updateUser(
    userId: string,
    updateUser: UpdateUserDto,
  ): Promise<Partial<User>> {
    const findUser = await this.userRepository.getUserById(userId);
    if (!findUser) throw new NotFoundException('User not found');
  
    
    let addressesArray: Address[] = [];
    if (updateUser.addresses && Array.isArray(updateUser.addresses)) {
      addressesArray = await Promise.all(
        updateUser.addresses.map(async (address) => {
          
          const coordinates = await this.geoCodingService.getCoordinates(
            address.street,
            address.number,
            address.city,
            address.state,
            address.postalCode,
          );
  
          if (!coordinates) {
            throw new NotFoundException(
              `Coordinates not found for address: ${JSON.stringify(address)}`,
            );
          }
  
          
          const addressObject = new Address();
          addressObject.street = address.street;
          addressObject.number = address.number;
          addressObject.postalCode = address.postalCode;
          addressObject.city = address.city;
          addressObject.state = address.state;
          addressObject.latitude = coordinates.latitude;
          addressObject.longitude = coordinates.longitude;
  
          return addressObject;
        }),
      );
    }
  
    
    const user = Object.assign(findUser, updateUser, {
      addresses: addressesArray,
    });
  
    const { password, ...userWithoutPass } = user;
  
    
    await this.userRepository.userUpdate(userId, user);
  
    return userWithoutPass;
  }

  async updateProfileImg(id: string, photo: Express.Multer.File) {
    const userUpdated = await this.userRepository.updateProfileImg(id, photo);
    return userUpdated;
  }

  async deactiveUser(id: string) {
    return await this.userRepository.deactivateUser(id);
  }

  async activeUser(id: string) {
    return await this.userRepository.activeUser(id);
  }

  async removeUser(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.removeUser(id);
    return 'User removed successfully';
  }
}
