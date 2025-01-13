import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/dtos/userDto';
import { LoginDto } from 'src/dtos/loginDto';
import { forgotPasswordDto } from 'src/dtos/forgotPasswordDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { UserService } from 'src/user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
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
  @ApiBearerAuth()
  @UseGuards(GoogleAuthGuard)
  @Post('google-login')
  async googleLogin(@Body() body: { email: string; firstname: string; lastname: string; photo: string, accessToken: string }) {
    const { email, firstname, lastname, photo, accessToken } = body;

    if (!email) {
      throw new BadRequestException('El email es obligatorio');
    }

    let user = await this.userService.getUserByEmail(email);
    // if(!user) {
    //   throw new NotFoundException('Usuario no encontrado en la base de datos')
    // }

    if (!user) {
      const userData = {
        email,
        firstname,
        lastname,
        photo,
        accessToken, 
        active: true,
      };

      user = await this.userService.createUser(userData);
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
