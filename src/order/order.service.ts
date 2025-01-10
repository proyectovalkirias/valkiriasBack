import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from 'src/dtos/createOrderDto';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderDetails.entity';
import { Product } from 'src/entities/product.entity';
import { UserRepository } from 'src/user/user.repository';
import { EntityManager, Repository } from 'typeorm';
import { OrderStatus } from 'src/utils/orderStatus.enum';
import { MpService } from 'src/mp/mp.service';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly userRepository: UserRepository,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly mercadoPagoService: MpService,
  ) {

  }

  async createOrder(createOrder: CreateOrderDto): Promise<{ url: string }> {
    let total = 0;
    const { userId, products } = createOrder;

    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const order = new Order();
    order.createdAt = new Date();
    order.updatedAt = new Date();
    order.user = user;

    const newOrder = await this.orderRepository.save(order);

    const productArray = await Promise.all(
      products.map(async (item) => {
        const product = await this.productRepository.findOneBy({ id: item.id });
        if (!product) throw new NotFoundException('Product not found');

        let productPrice = null;
        product.sizes.map((size) => {
          if (
            size === '4' ||
            size === '6' ||
            size === '8' ||
            size === '10' ||
            size === '12' ||
            size === '14' ||
            size === '16'
          ) {
            productPrice = product.prices[0];
          }
          if (
            size === 'S' ||
            size === 'M' ||
            size === 'L' ||
            size === 'XL' ||
            size === 'XXL'
          ) {
            if (product.prices[1]) {
              productPrice = product.prices[1];
            } else {
              productPrice = product.prices[0];
            }
          }
        });
        if (!productPrice) {
          throw new NotFoundException(`Price for size ${item.size} not found`);
        }

        total += Number(productPrice);
        product.stock -= 1;
        await this.productRepository.save(product);
        return product;
      }),
    );

    const orderDetail = new OrderDetail();
    orderDetail.order = newOrder;
    orderDetail.product = productArray;
    orderDetail.price = Number(Number(total).toFixed(2));

    await this.orderDetailRepository.save(orderDetail);

    const preference =
      await this.mercadoPagoService.createPaymentPreference(products);
    return {
      url: preference.url,
    };

    // return await this.orderRepository.findOne({
    //   where: { id: newOrder.id },
    //   relations: { orderDetail: { product: true } },
    // });
  }

  async getOrderUserId(userId: string) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderDetail', 'orderDetail.product'],
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found for this user');
    }

    return orders;
  }

  getOrder(id: string) {
    const order = this.orderRepository.findOne({
      where: { id },
      relations: { orderDetail: { product: true } },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  getAllOrders() {
    const orders = this.orderRepository.find();
    return orders;
  }

  async deleteOrder(id: string) {
    return await this.productRepository.manager.transaction(
      async (manager: EntityManager) => {
        const order = await this.orderRepository.findOne({
          where: { id },
          relations: ['orderDetail', 'orderDetail.product'],
        });

        if (!order) throw new NotFoundException('Order not found');

        const orderDetail = order.orderDetail;
        if (orderDetail && orderDetail.product.length > 0) {
          for (const product of orderDetail.product) {
            product.stock += 1;
            await manager.save(product);
          }

          await manager.delete(OrderDetail, { order: { id } });

          await manager.delete(Order, id);
        }

        return `Order with id ${id} has been delete`;
      },
    );
  }

  async getOrderStatus(): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status: OrderStatus.PENDING },
    });
  }

  async validStatus(currentStatus: OrderStatus, newStatus: OrderStatus) {
    const statusFlow: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.IN_PREPARATION],
      [OrderStatus.IN_PREPARATION]: [OrderStatus.ON_THE_WAY],
      [OrderStatus.ON_THE_WAY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
    };
    return statusFlow[currentStatus]?.includes(newStatus) || false;
  }

  async updateOrderStatusManual(
    orderId: string,
    newStatus: OrderStatus,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error('Order not found');
    }

    if (!this.validStatus(order.status as OrderStatus, newStatus)) {
      throw new Error('Invalid status transition');
    }

    order.status = newStatus;
    return this.orderRepository.save(order);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    await this.orderRepository.update(orderId, {
      status,
      updatedAt: new Date(),
    });
  }
}
