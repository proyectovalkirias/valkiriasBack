import { BadRequestException, Injectable } from '@nestjs/common';
import { mercadoPagoConfig } from '../config/mpConfig';
import { Payment, Preference } from 'mercadopago';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class MpService {
  // private preference: Preference;
  constructor(private readonly productService: ProductService) {
    // this.preference = new Preference(mercadoPagoConfig);
  }

  async createPaymentPreference(products: any[]) {
    try {
      const items = [];
      for (const product of products) {
        const findProduct = await this.productService.getProductById(
          product.id,
        );
        if (!findProduct) {
          throw new BadRequestException('Product not found');
        }

        if (product.quantity > findProduct.stock) {
          throw new BadRequestException(
            'Product quantity is greated than stock',
          );
        }

        items.push({
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
            success: 'valkiriasfront.onrender.com/Mp/success',
            failure: 'valkiriasfront.onrender.com/Mp/failure',
            pending: 'valkiriasfront.onrender.com/Mp/pending',
          },
          auto_return: 'approved',
        },
      };

      const response = await new Preference(mercadoPagoConfig).create(
        preferenceData,
      );
      // const response = await this.preference.create(preferenceData)
      return {
        url: response.init_point,
      };
    } catch (error) {
      console.error('Failed to create payment preference:', error);
      throw new Error('Failed to create payment preference');
    }
  }

  async webhookMp(body: any) {
    try {
      if (!body || !body.preferenceData)
        throw new BadRequestException('Invalid webhook body');

      const payment = await new Payment(mercadoPagoConfig).get(
        body.preferenceData,
      );
      console.log('Payment received:', payment);

      if (payment.status === 'approved') {
        console.log('Payment approved:', payment.order);
      } else if (payment.status === 'rejected') {
        console.log('Payment rejected:', payment.id);
      }
    } catch (error) {
      console.error('Error processing webhook:', error.message);
      throw new Error('Failed to process webhook');
    }
  }
}
