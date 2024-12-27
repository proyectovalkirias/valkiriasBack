import { Module } from '@nestjs/common';
import { ValkibotController } from './valkibot.controller';
import { ValkibotService } from './valkibot.service';

@Module({
  controllers: [ValkibotController],
  providers: [ValkibotService]
})
export class ValkibotModule {}
