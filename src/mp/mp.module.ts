import { Module } from '@nestjs/common';
import { MpController } from './mp.controller';
import { MpService } from './mp.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports:[ProductModule],
  controllers: [MpController],
  providers: [MpService]
})
export class MpModule {}
