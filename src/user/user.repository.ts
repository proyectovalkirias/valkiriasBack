import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async userUpdate(id: string, updateUser: Partial<User>) {
    if (updateUser.password) {
      updateUser.password = await bcrypt.hash(updateUser.password, 10);
    }
    return await this.userRepository.update(id, updateUser);
  }

  async deactivateUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!user) throw new NotFoundException('User not found');

    user.active = false;
    await this.userRepository.save(user);

    return 'Disabled User';
  }

  async activeUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User bnot found');

    user.active = true;
    await this.userRepository.save(user);

    return 'Active User';
  }

  removeUser(id: string) {
    return this.userRepository.delete({ id: id });
  }
}
