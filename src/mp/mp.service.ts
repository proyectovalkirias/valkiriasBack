import { BadRequestException, Injectable } from '@nestjs/common';
import { mercadoPagoConfig } from '../config/mpConfig';
import { Preference } from 'mercadopago';
import { ProductService } from 'src/product/product.service';



@Injectable()
export class MpService {
    private preference: Preference;
    
    constructor(private readonly productService: ProductService){
        this.preference = new Preference(mercadoPagoConfig);
    }

    async createPaymentPreference(products: any[]) {

        try {
            const items = [];
            for (const product of products) {
                const findProduct = await this.productService.getProductById(product.id);
                if(!findProduct) {
                    throw new BadRequestException('Product not found');
                }

                if(product.quantity > findProduct.stock) {
                    throw new BadRequestException('Product quantity is greated than stock');
                }

                items.push ({
                    id: product.id,
                    title: product.name,
                    quantity: product.quantity,
                    unit_price: product.price,
                    currency_id: 'ARS',
                });
            }

            const preferenceData = {
                body: {
                    items,
                    back_urls: {
                        success: 'https://localhost:3000/mp/success',
                        failure: 'https://localhost:3000/mp/failure',
                        pending: 'https://localhost:3000/mp/pending',
                    },
                    auto_return: 'approved',
                }
            };

            const response = await new Preference(mercadoPagoConfig).create(preferenceData)
            return {
                url: response.init_point
            }
            
        } catch (error) {
            console.error('Error al crear la preferencia de pago:', error);
            throw new Error('Error al crear la preferencia de pago');
        }
    }
}
