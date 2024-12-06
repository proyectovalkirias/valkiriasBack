import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { transporter } from 'src/config/mailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { forgotPasswordDto } from 'src/dtos/forgotPasswordDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userDBRepository: Repository<User>,
  ) {}

  async signUp(user: Partial<User>) {
    const { email, password } = user;
    if (!email || !password) throw new BadRequestException('Required');

    const foundUser = await this.userRepository.getUserByEmail(user.email);
    if (foundUser) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!hashedPassword)
      throw new BadRequestException('Password could nor hashed');

    console.log(hashedPassword);

    await this.userRepository.createUser({
      ...user,
      password: hashedPassword,
    });

    await transporter.sendMail({
      from: '"Te Registraste en Valkirias ✍" <proyecto.valkirias@gmail.com>',
      to: user.email,
      subject: 'Registro existoso',
      html: `
          <b>Te has registrado en la página Valkirias correctamente, ahora solo debes iniciar sesión.</b>
          <b>Toca aquí para dirigirte directamente al inicio de sesión en Valkirias: <a href="http://localhost:3001/Login">Ir a Iniciar Sesión</a></b>
          `, // Se debe cambiar al link de render o donde despleguemos a la hora de presentar.
    });

    return 'User created successfully';
  }

  async login(email: string, password: string) {
    if (!email || !password) throw new BadRequestException('Required');

    const user = await this.userRepository.getUserByEmail(email);

    if (!user) throw new NotFoundException('Invalid Credentials');

    const passwordValidation = await bcrypt.compare(password, user.password);
    if (!passwordValidation)
      throw new BadRequestException('Invalid Credentials');

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    await transporter.sendMail({
      from: '"Iniciaste Sesión en Valkirias 👌" <proyecto.valkirias@gmail.com>',
      to: user.email,
      subject: 'Inicio de sesión exitoso',
      html: `
          <b>Has iniciado sesión en la página de Valkirias con éxito, para poder reservar solo debes completar todos los datos de tu perfil.</b>
          <b>Toca aquí para dirigirte directamente al Home de Valkirias: <a href="http://localhost:3001">Ir al Home</a></b>
          `, // Se debe cambiar al link de render o donde despleguemos a la hora de presentar.
    });

    return {
      message: 'Loggin Succefully',
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
          <b>Toca aquí para poder cambiar tu contraseña: <a href="http://localhost:3001/ChangePassword">Cambiar contraseña</a></b>
          `, // Se debe cambiar al link de render o donde despleguemos a la hora de presentar.
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
}
