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
  constructor(
    private readonly googleService: GoogleService,
  ) {}

  @Get('redirect')
  async handleGoogleAuth(@Query('code') code: string, @Res() res: Response) {
    console.log("Received code:", code);
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
      res.status(HttpStatus.OK).json({
        // user: userInfo,
        token: accessToken, 
      });
    } catch (error) {
      console.error('Google Auth error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error handling Google Auth',
        error: error.message,
      });
    }
  }
}



  // @Post()
  // async handleGoogleAuth(@Body('code') code: string, @Res() res: Response) {
  //   try {
  //     if (!code) {
  //       throw new HttpException('Missing Google authorization code', HttpStatus.BAD_REQUEST);
  //     }

  //     const tokenResponse = await axios.post(
  //       'https://oauth2.googleapis.com/token',
  //       {
  //         code,
  //         client_id: process.env.GOOGLE_CLIENT_ID,
  //         client_secret: process.env.GOOGLE_CLIENT_SECRET,
  //         redirect_uri: 'http://localhost:3001/Landing',
  //         grant_type: 'authorization_code',
  //       }
  //     );

  //     const userInfoResponse = await axios.get(
  //       'https://www.googleapis.com/oauth2/v1/userinfo',
  //       {
  //         headers: {
  //           Authorization: `Bearer ${tokenResponse.data.access_token}`,
  //         },
  //       }
  //     );

  //     res.status(HttpStatus.OK).json(userInfoResponse.data);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: 'Error handling Google Auth',
  //       error: error.message,
  //     });
  //   }
  // }


  
  

  // @Get()
  // @UseGuards(AuthGuard('google'))
  // googleLogin() {
  //   return 'Redirecting to Google...';
  // }

  // @Get('redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleRedirect(@Req() req, @Res() res: Response) {
  //   const user = req.user;

  //   console.log('User after Google authentication:', req.user);

  //   if (!user) {
  //     throw new BadRequestException('Google autentication failed');
  //   }

  //   const loginResponse = await this.googleService.googleLogin(user)


  //    return res.status(200).json(loginResponse);  
  // }

