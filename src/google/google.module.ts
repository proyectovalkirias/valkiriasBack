import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';

@Module({
  providers: [GoogleService],
  controllers: [GoogleController]
})
export class GoogleModule {}
