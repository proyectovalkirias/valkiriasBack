import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { MpService } from './mp.service';
import { url } from 'inspector';

@Controller('payment')
export class MpController {
    constructor(private readonly mercadoPagoService: MpService) {}

    @Post('create')
    async creaPayment(@Body() products: any[]) {
        if(!products || !Array.isArray) {
            throw new BadRequestException('Invalid or empty products list');
        }
        try {
            const preference = await this.mercadoPagoService.createPaymentPreference(products);

            return{
                message: 'Payment preference created',
                url: preference.url,
            }
        } catch (error) {
            console.error('Error in createPaymentPreference:', error);
            throw new BadRequestException(
                error.message || 'Failed to create payment preference.'
            );
        }
    }

}
