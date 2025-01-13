import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from 'src/config/cloudinary';
import { transporter } from 'src/config/mailer';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryProvider: CloudinaryService,
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

  async updateProfileImg(id: string, photo: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const uploadImg = await this.cloudinaryProvider.uploadImage(photo);
    user.photo = uploadImg.secure_url;
    await this.userRepository.save(user);
    return 'Profile image updated succesfully';
  }

  async deactivateUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!user) throw new NotFoundException('User not found');

    user.active = false;
    await this.userRepository.save(user);
    await transporter.sendMail({
      from: '"Valkirias" <proyecto.valkirias@gmail.com>',
      to: user.email,
      subject: 'Usuario desactivado',
      html: `Su usuario incumplió alguna norma o condición en la página de Valkirias, si se trata de una confusión, por favor, responda a este mismo mail y aguarde a que le respondamos.`,
    });

    return 'Disabled User';
  }

  async activeUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    user.active = true;
    await this.userRepository.save(user);

    await transporter.sendMail({
      from: '"Valkirias" <proyecto.valkirias@gmail.com>',
      to: user.email,
      subject: 'Usuario Activado',
      html: `Su usuario a sido activado en la página de Valkirias.`,
    });

    return 'Active User';
  }

  async removeUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const deletedUser = this.userRepository.delete({ id: id });
    await transporter.sendMail({
      from: '"Valkirias" <proyecto.valkirias@gmail.com>',
      to: user.email,
      subject: 'Usuario eliminado',
      html: `Su usuario ha sido eliminado de la página de Valkirias, si fue una confusión, por favor, responda a este mismo email y aguarde a que le respondamos.`,
    });
    return deletedUser;
  }

  async changeIsAdmin(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    console.log('User en changeAddmin:', user)
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // if (user.isAdmin === true) {
    //   user.isAdmin = false;
    // } else {
    //   user.isAdmin = true;
    // }
    user.isAdmin = !user.isAdmin;

    await this.userRepository.save(user);
    return 'Se modifico isAdmin en el usuario';
    // if (user.isAdmin === true) {
    //   return 'User changed to admin';
    // } else {
    //   return 'Admin changed to user';
    // }
  }


}
