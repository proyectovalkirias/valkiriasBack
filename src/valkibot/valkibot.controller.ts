import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ValkibotService } from './valkibot.service';
import { ChatLog } from 'src/entities/chatLog.entity';

@Controller('valkibot')
export class ValkibotController {
  constructor(private readonly valkiBotService: ValkibotService) {}

  @Post()
  async handleMessage(@Body('message') message: string) {
    const { reply, options } = await this.valkiBotService.getResponse(message);
    return { reply, options };
  }

  @Get('/messages/:userId')
  async getMessages(@Param('userId') userId: string): Promise<ChatLog[]> {
    return this.valkiBotService.getMessagesById(userId);  
  }
}
