import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './google.service';
import { Response } from 'express';

@ApiTags('google')
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('redirect')
  async handleGoogleAuth(@Query('code') code: string, @Res() res: Response) {
    console.log('Received code:', code);
    try {
      // Verifica si el código está presente en la URL
      if (!code) {
        throw new BadRequestException('Authorization code is required');
      }

      // Obtiene el token de Google usando el servicio
      const accessToken = await this.googleService.getGoogleAuthToken(code);
      console.log('Received access token:', accessToken);

      // Obtiene la información del usuario con el token
      const userInfo = await this.googleService.getUserInfo(accessToken);
      res.redirect(`http://localhost:3001`);
      // res.status(HttpStatus.OK).json({
      //   // user: userInfo,
      //   token: accessToken,
      // });
    } catch (error) {
      console.error('Google Auth error:', error);
      // res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      //   message: 'Error handling Google Auth',
      //   error: error.message,
      // });
    }
  }
}
