import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
      if (!code) {
        throw new BadRequestException('Authorization code is required');
      }

      
      const accessToken = await this.googleService.getGoogleAuthToken(code);
      console.log('Received access token:', accessToken);
      
      
      const user = await this.googleService.handleGoogleAuth(accessToken);

      res.status(HttpStatus.OK).json({
        message: 'User authenticated successfully',
        token: accessToken,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          photo: user.photo,
        },
      });

      // return {
      //   token: accessToken,
      //   user: {
      //     id: user.id,
      //     firstname: user.firstname,
      //     lastname: user.lastname,
      //     email: user.email,
      //     photo: user.photo,
      //   },
      // };


      // res.redirect(`http://localhost:3001?token=${accessToken}&user=${JSON.stringify(user)}`);
   
    } catch (error) {
      console.error('Google Auth error:', error);
      res.status(400).send('Error during Google Authentication');
    }
  }

  @ApiOperation({ summary: 'Logout'})
  @Post('logout')
  async googleLogout(@Body('token') token: string, @Res() res: Response) {
    try {
      if(!token) throw new BadRequestException('Token is required');

      await this.googleService.revokeGoogleToken(token);
      res.status(HttpStatus.OK).json({message: 'Logout successfull'});

    } catch (error) {
      console.error('Google Logout error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error handling Google Logout',
        error: error.message,
      });
    }
  }
  
}
