import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/dtos/userDto';
import { UpdateUserDto } from 'src/dtos/updateUserDto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

    const user = Object.assign(findUser, updateUser);
    const { password, ...userWithoutPass } = user;

    return userWithoutPass;
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
