import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MpService } from './mp.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';

@ApiTags('payment')
@Controller('payment')
export class MpController {
  constructor(private readonly mercadoPagoService: MpService) {}

  @ApiOperation({ summary: 'Create a payment with Mercado Pago.' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, GoogleAuthGuard)
  @Post('create')
  async creaPayment(@Body() products: any[], orderId: string) {
    console.log('Request body:', products);
    if (!products || !Array.isArray(products)) {
      throw new BadRequestException('Invalid or empty products list');
    }
    try {
      console.log('Received products:', products);
      const preference =
        await this.mercadoPagoService.createPaymentPreference(products, orderId);

      return {
        message: 'Payment preference created',
        url: preference.url,
      };
    } catch (error) {
      console.error('Error in createPaymentPreference:', error);
      throw new BadRequestException(
        error.message || 'Failed to create payment preference.',
      );
    }
  }

  @ApiOperation({ summary: 'Mp notifications' })
  @Post('webhooks')
  async webhookMp(@Body() body: any) {
    try {
      if (!body || !body.preferenceData) {
        throw new BadRequestException('Invalid webhook body');
      }

      await this.mercadoPagoService.webhookMp(body);
      return {
        status: 'Success',
      };
    } catch (error) {
      console.error('Error processing webhook:', error.message);
      throw new BadRequestException('Failed to process webhook');
    }
  }
}
