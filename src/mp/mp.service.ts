import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { mercadoPagoConfig } from '../config/mpConfig';
import { Payment, Preference } from 'mercadopago';
import { ProductService } from 'src/product/product.service';
import { transporter } from 'src/config/mailer';
import { OrderService } from 'src/order/order.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from 'src/utils/orderStatus.enum';



@Injectable()
export class MpService {
  // private preference: Preference;
  constructor(
    private readonly productService: ProductService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    // this.preference = new Preference(mercadoPagoConfig);
  }

  async createPaymentPreference(products: any[], orderId: string) {
    try {
      const items = [];
      for (const product of products) {
        const findProduct = await this.productService.getProductById(
          product.id,
        );
        if (!findProduct) {
          throw new BadRequestException('Producto no encontrado');
        }

        if (product.quantity > findProduct.stock) {
          throw new BadRequestException(
            'La cantidad seleccionada supera el stock',
          );
        }

        const productPrice = findProduct.prices.find(
          (price) => price.size === product.size,
        );
  
        if (!productPrice) {
          throw new BadRequestException('Precio no encontrado para el talle seleccionado');
        }

        items.push({
          id: product.id,
          title: product.name,
          quantity: product.quantity,
          unit_price: productPrice.price,
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
          external_reference: orderId,
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
      throw new Error('Fallo en la creación de preferencia de pago');
    }
  }

  async webhookMp(body: any) {
    try {
      if (!body || !body.preferenceData)
        throw new BadRequestException('Webhook invalido');

      const payment = await new Payment(mercadoPagoConfig).get(
        body.preferenceData,
      );
      console.log('Payment received:', payment);

      const orderId = body.preferenceData.external_reference;
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['user', 'orderDetails'],
      });

      if(!order) {
        throw new NotFoundException('Order not found');
      }

      if (!order.user || !order.user.email) {
        throw new NotFoundException('Usuario o correo no encontrados en la orden');
      }

      if (payment.status === 'approved') {
        console.log('Payment approved:', payment.order);
          await this.orderService.updateOrderStatus(orderId, OrderStatus.IN_PREPARATION);  
          
          await transporter.sendMail({
          from: '"Valkirias" <proyecto.valkirias@gmail.com>',
          to: order.user.email,
          subject: 'Pago realizado con éxito',
          html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #3e1a4d; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #b093bf; text-align: center; margin-bottom: 20px;">¡Gracias por tu compra!</h1>
            <p style="font-size: 16px; color: #7b548b; margin-bottom: 10px;">Hola <strong>${order.user.firstname}</strong>,</p>
            <p style="color: #3e1a4d; margin-bottom: 20px;">
              Nos complace informarte que tu pago ha sido <strong style="color: #d57159;">aprobado</strong> con éxito. Tu pedido está en preparación.
            </p>
            <p style="color: #3e1a4d; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Detalles del pedido:</p>
            
            <!-- Detalles del producto -->
            <ul style="list-style: none; padding: 0; margin-bottom: 20px; color: #7b548b;">
              ${order.orderDetail.product.map(
                (prod) => `
                  <li style="margin-bottom: 10px; font-size: 15px;">
                    <span style="font-weight: bold; color: #b093bf;">${prod.name}</span> - ${order.orderDetail.quantity} x $${order.orderDetail.price}
                  </li>`
              ).join('')}
            </ul>
      
            <hr style="border: 0; border-top: 1px solid #b093bf; margin: 20px 0;">
            <p style="font-size: 14px; color: #7b548b; margin-bottom: 20px;">
              Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://valkiriasfront.onrender.com/Home" style="display: inline-block; background-color: #b093bf; color: #fff; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; font-weight: bold;">
                Ir al Home
              </a>
            </div>
            <p style="text-align: center; font-size: 12px; color: #7b548b; margin-top: 20px;">
              &copy; 2025 Valkirias. Todos los derechos reservados.
            </p>
          </div>
        `,
        });
      } else if (payment.status === 'rejected') {
        console.log('Payment rejected:', payment.id);
        await this.orderService.updateOrderStatus(orderId, OrderStatus.PENDING);
          await transporter.sendMail({
          from: '"Valkirias" <proyecto.valkirias@gmail.com>',
          to: order.user.email,
          subject: 'Pago rechazado',
          html: `
           <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #3e1a4d; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
           <h1 style="color: #d57159; text-align: center; margin-bottom: 20px;">Hubo un problema con tu pago</h1>
           <p style="font-size: 16px; color: #7b548b; margin-bottom: 10px;">Hola <strong>${order.user.firstname}</strong>,</p>
           <p style="color: #3e1a4d; margin-bottom: 20px;">
           Lamentamos informarte que tu pago no se ha podido procesar correctamente. Por favor, verifica los detalles de tu tarjeta o método de pago e inténtalo nuevamente.
           </p>

           <hr style="border: 0; border-top: 1px solid #b093bf; margin: 20px 0;">
           <p style="font-size: 14px; color: #7b548b; margin-bottom: 20px;">
           Si necesitas ayuda, no dudes en contactarnos para resolver cualquier inconveniente.
           </p>
           <div style="text-align: center; margin-top: 20px;">
           <a href="https://valkiriasfront.onrender.com/Home" style="display: inline-block; background-color: #d57159; color: #fff; text-decoration: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; font-weight: bold;">
           Regresar al Home
           </a>
           </div>
           <p style="text-align: center; font-size: 12px; color: #7b548b; margin-top: 20px;">
          &copy; 2025 Valkirias. Todos los derechos reservados.
      </p>
    </div>
  `,
      });
  }
    } catch (error) {
      console.error('Error processing webhook:', error.message);
      throw new Error('Fallo al procesar webhoook');
    }
  }
}
