import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiTags('google')
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    return 'Redirecting to Google...';
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;

    console.log('User after Google authentication:', req.user);

    if (!user) {
      throw new BadRequestException('Google autentication failed');
    }

    const loginResponse = await this.googleService.googleLogin(user)


     return res.status(200).json(loginResponse);  
  }
}
