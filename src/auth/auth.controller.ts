import {
  Body,
  Controller,
  Get,
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
