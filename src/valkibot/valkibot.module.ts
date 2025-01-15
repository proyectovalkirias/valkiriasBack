import { Module } from '@nestjs/common';
import { ValkibotController } from './valkibot.controller';
import { ValkibotService } from './valkibot.service';
import { ValkibotGateway } from './valkibotgateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLog } from 'src/entities/chatLog.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatLog, User])],
  controllers: [ValkibotController],
  providers: [ValkibotService, ValkibotGateway],
})
export class ValkibotModule {}
