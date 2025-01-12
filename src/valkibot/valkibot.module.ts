import { Module } from '@nestjs/common';
import { ValkibotController } from './valkibot.controller';
import { ValkibotService } from './valkibot.service';
import { ValkibotGateway } from './valkibotgateway';

@Module({
  controllers: [ValkibotController],
  providers: [ValkibotService, ValkibotGateway],
})
export class ValkibotModule {}
