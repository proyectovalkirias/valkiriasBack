import { Body, Controller, Post } from '@nestjs/common';
import { ValkibotService } from './valkibot.service';

@Controller('valkibot')
export class ValkibotController {
    constructor(private readonly valkiBotService: ValkibotService) {}

    @Post()
    async handleMessage(@Body('message') message: string) {
      const { reply, options } = await this.valkiBotService.getResponse(message);
      return { reply, options };
    }
}
