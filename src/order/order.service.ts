import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from 'src/dtos/createOrderDto';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderDetails.entity';
import { Product } from 'src/entities/product.entity';
import { UserRepository } from 'src/user/user.repository';
import { EntityManager, Repository} from 'typeorm';
import { OrderStatus } from 'src/utils/orderStatus.enum';
import { MpService } from 'src/mp/mp.service';
import { validate as isUUID } from 'uuid';
import { Address } from 'src/entities/address.entity';
import { UserService } from 'src/user/user.service';


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
    @Inject(forwardRef(() => MpService))
    private readonly mercadoPagoService: MpService,
    @InjectRepository(Address)
    private readonly userService: UserService,
  ) {

  }

  async createOrder(createOrder: CreateOrderDto): Promise<{ url: string }> {
    let total = 0;
    const { userId, addressId, products } = createOrder;

    if(!isUUID(userId)) {
      throw new BadRequestException(`Invalid user Id: ${userId}`);
    }

    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const address = await this.userService.getAddressById(addressId)
    if(!address) {
      throw new NotFoundException('Dirección para envio de pedido no encontrada')
    }

    const order = new Order();
    order.createdAt = new Date();
    order.updatedAt = new Date();
    order.user = user;
    order.userAddress = address;
    order.status = OrderStatus.PENDING;

    const newOrder = await this.orderRepository.save(order);

    const productArray = await Promise.all(
      products.map(async (item) => {
        console.log('Product ID:', item.id);
        const product = await this.productRepository.findOneBy({ id: item.id });
        if (!product) throw new NotFoundException(`Product ${item.id} not found`);

        // total += Number(productPrice);
        const productPrice = product.prices.find(
          (price) => price.size === item.size,
        );

        if(!productPrice) {
          throw new BadRequestException(`Price not found for size ${item.size} of product ${item.id}`);
        }

        if(!productPrice || isNaN(productPrice.price)) {
          throw new BadRequestException(`Invalid price for product ${productPrice.price}`)
        }

        total += productPrice.price;
        if(product.stock < item.quantity) {
          throw new BadRequestException('Stock insuficiente')
        }

        product.stock -= item.quantity;
        await this.productRepository.save(product);

        return product;
      }),
    );

    const orderDetail = new OrderDetail();
    orderDetail.order = newOrder;
    orderDetail.product = productArray;
    orderDetail.price = Number(total.toFixed(2));
    orderDetail.size = products[0].size;
    orderDetail.quantity = products.reduce((sum, item) => sum + item.quantity, 0);
    // orderDetail.price = Number(Number(total).toFixed(2));

    await this.orderDetailRepository.save(orderDetail);

    const preference =
      await this.mercadoPagoService.createPaymentPreference(
        products,
        newOrder.id,
      );
 
    return {
      url: preference.url,
    };

  }

  async getOrderUserId(userId: string) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderDetail', 'orderDetail.product'],
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('No existen ordenes para este usuario');
    }

    return orders;
  }

  getOrder(id: string) {
    const order = this.orderRepository.findOne({
      where: { id },
      relations: [ 'orderDetail', 'orderDetail.product', 'orderTrack'],
    });

    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }

  async getAllOrders() {
    const orders = await this.orderRepository.find();
    if (orders.length === 0) {
      throw new NotFoundException('No hay órdenes disponibles.');
    }
    
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
      relations: [' userAddress']
    });
    if (!order) {
      throw new Error('Orden no encontrada');
    }

    if(!order.userAddress) {
      throw new NotFoundException('Este pedido no tiene una dirección de envio asociada')
    }

    if (!this.validStatus(order.status as OrderStatus, newStatus)) {
      throw new Error('Cambio de estado inválido');
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
