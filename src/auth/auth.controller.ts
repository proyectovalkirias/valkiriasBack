import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/dtos/userDto';
import { LoginDto } from 'src/dtos/loginDto';
import { forgotPasswordDto } from 'src/dtos/forgotPasswordDto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  @ApiOperation({ summary: 'SignUp' })
  @Post('signup')
  signUp(@Body() user: UserDto) {
    return this.authService.signUp(user);
  }

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  login(@Body() login: LoginDto) {
    const { email, password } = login;
    return this.authService.login(email, password);
  }

  @ApiOperation({ summary: `Forgot Password` })
  @Get(`:email`)
  forgotPassword(@Param(`email`) email: string) {
    return this.authService.forgotPassword(email);
  }

  @ApiOperation({ summary: `Change Password` })
  @Put(`change-password`)
  changePassword(
    @Query(`email`) email: string,
    @Body() newPassword: forgotPasswordDto,
  ) {
    return this.authService.changePassword(email, newPassword);
  }


  @ApiOperation({ summary: 'Login Google'})
  // @ApiBearerAuth()
  // @UseGuards(GoogleAuthGuard)
  @Post('google-login')
  async googleLogin(@Body() body: { email: string; firstname: string; lastname: string; photo: string, accessToken: string }) {
    const { email, firstname, lastname, photo, accessToken } = body;

    if (!email) {
      throw new BadRequestException('El email es obligatorio');
    }

    let user = await this.userRepository.findOne({where: {email}});
 
    console.log("usuario encontrado", user)
    if (!user) {
      const userData = {
        email,
        firstname,
        lastname,
        photo,
        accessToken, 
        active: true,
      };

      user = this.userRepository.create(userData);
      user= await this.userRepository.save(user);
      console.log("usuario creado", user)
      console.log('Usuario guardado en la Db')
    } else {
      user.accessToken = accessToken;
      user = await this.userRepository.save(user);
    console.log("usuario actualizado con accessToken", user);  
    }

    const token = this.authService.generateToken({
      id: user.id,
      email: user.email,
      role: user.isAdmin ? 'admin' : 'user',
    });

    return {
      message: '¡Login con Google exitoso!',
      user,
      token
    };
  }
}

