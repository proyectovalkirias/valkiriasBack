import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { MpService } from './mp.service';
import { url } from 'inspector';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('payment')
@Controller('payment')
export class MpController {
    constructor(private readonly mercadoPagoService: MpService) {}


    @ApiOperation({summary: 'Create a payment with Mercado Pago.'})
    @Post('create')
    async creaPayment(@Body() products: any[]) {
        console.log('Request body:', products);
        if(!products || !Array.isArray(products)) {
            throw new BadRequestException('Invalid or empty products list');
        }
        try {
            console.log('Received products:', products);
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
