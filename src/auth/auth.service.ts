import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { transporter } from 'src/config/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
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
          <b>Toca aquí para dirigirte directamente al inicio de sesión en Valkirias: <a href="">Ir a Iniciar Sesión</a></b>
          `, // Se pondría el link de front de iniciar sesión.
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
          <b>Toca aquí para dirigirte directamente al Home de Valkirias: <a href="">Ir al Home</a></b>
          `, // Se pondría el link de front del home.
    });

    return {
      message: 'Loggin Succefully',
      token,
      user,
    };
  }
}
