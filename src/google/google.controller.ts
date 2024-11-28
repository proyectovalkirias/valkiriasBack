import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('google')
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    return 'Redirecting to Google';
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req) {
    const res = this.googleService.googleLogin(req);
    if (!res) {
      throw new NotFoundException('Google login failed');
  
    }
     return({
      token: (await res).token
    })
   
  }
}
