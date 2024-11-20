import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GoogleModule } from './google/google.module';

@Module({
  imports: [AuthModule, UserModule, GoogleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
