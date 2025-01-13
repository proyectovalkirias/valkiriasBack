import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { transporter } from 'src/config/mailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { forgotPasswordDto } from 'src/dtos/forgotPasswordDto';
import { registerMail } from 'src/mails/registerMail';
import { Role } from 'src/utils/Role/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userDBRepository: Repository<User>,
  ) {}

  async signUp(user: Partial<User>) {
    const { email, password } = user;
    if (!email || !password) throw new BadRequestException('Email y Contraseña son requeridos');

    const foundUser = await this.userRepository.getUserByEmail(user.email);
    if (foundUser) throw new BadRequestException('El email ya se encuentra registrado');

    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log('Encriptado pass:', hashedPassword);
    if (!hashedPassword)
      throw new BadRequestException('Error al encriptar contraseña');


    await this.userRepository.createUser({
      ...user,
      password: hashedPassword,
    });

    await transporter.sendMail({
      from: '"Valkirias" <proyecto.valkirias@gmail.com>',
      to: user.email,
      subject: 'Registro existoso',
      html: registerMail,
    });

    return 'Usuario creado';
  }

  async login(email: string, password: string) {
    if (!email || !password) throw new BadRequestException('Email y contraseña requeridos');

    const user = await this.userRepository.getUserByEmail(email);
    console.log('USER en login:', user);
    if (!user) throw new NotFoundException('Credenciales invalidas');
    if (user.active === false) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const passwordValidation = await bcrypt.compare(password, user.password);
    console.log('Pass User Login:', passwordValidation)
    if (!passwordValidation)
      throw new BadRequestException('Credenciales invalidas');

    const payload = {
      id: user.id,
      email: user.email,
      role: user.isAdmin ? Role.Admin : Role.User,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: '¡Login exitoso!',
      token,
      user,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }
    await transporter.sendMail({
      from: '"Olvidaste tu contraseña" <proyecto.valkirias@gmail.com>',
      to: user.email,
      subject: 'Cambiar contraseña',
      html: `
          <b>Has olvidado tu contraseña?</b>
          <b>Toca aquí para poder cambiar tu contraseña: <a href="https://valkiriasfront.onrender.com/ChangePassword">Cambiar contraseña</a></b>
          `,
    });
    return `Te enviamos un gmail para cambiar tu contraseña, por favor verificalo`;
  }

  async changePassword(email: string, newPassword: forgotPasswordDto) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }
    const isSamePassword = await bcrypt.compare(
      newPassword.password,
      user.password,
    );
    if (isSamePassword) {
      throw new ConflictException(`La contraseña no puede ser la misma`);
    }
    if (newPassword.password !== newPassword.confirmPassword) {
      throw new ConflictException(`Las contraseñas deben coincidir`);
    }
    const hashedPassword = await bcrypt.hash(newPassword.confirmPassword, 10);
    user.password = hashedPassword;
    this.userDBRepository.save(user);
    await transporter.sendMail({
      from: '"Cambiaste tu contraseña" <proyecto.valkirias@gmail.com>',
      to: user.email,
      subject: 'Cambio de contraseña',
      html: `
          <b>Cambiaste tu contraseña en Valkirias, por favor, si no fuiste tú, responda a este mail y espere a que le respondamos.</b>
          `,
    });
    return `La contraseña se cambió correctamente.`;
  }

  // generateToken(payload: any): string {
  //   return this.jwtService.sign(payload);
  // }
}
