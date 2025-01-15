import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/dtos/createOrderDto';
import { OrderStatus } from 'src/utils/orderStatus.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'New Order' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  newOrder(@Body() createOrderDto: CreateOrderDto): Promise<{ url: string }> {
    return this.orderService.createOrder(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all Orders' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Get('orders')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @ApiOperation({ summary: 'Get Order By Id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @ApiOperation({ summary: 'Delete Order' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }

  @ApiOperation({ summary: 'Get Order By User' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('user/:id')
  getOrderByUser(@Param('userId') userId: string) {
    return this.orderService.getOrderUserId(userId);
  }

  @ApiOperation({ summary: 'Order Status' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') orderId: string,
    @Body() newStatus: OrderStatus,
  ) {
    if (!Object.values(OrderStatus).includes(newStatus)) {
      throw new Error('Estado inválido');
    }
    return this.orderService.updateOrderStatusManual(orderId, newStatus);
  }

  @ApiOperation({ summary: 'Order Status Manual'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':orderId/status/manual')
  async updateOrderStatusManual(
    @Param('orderId') orderId: string,
    @Body('newStatus') newStatus: OrderStatus,
  ) {
    try {
      const updatedOrder = await this.orderService.updateOrderStatusManual(orderId, newStatus);
      return updatedOrder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }


  @ApiOperation({ summary: 'Update Order'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    await this.orderService.updateOrderStatus(orderId, status);
    return { message: 'Estado de la orden actualizado correctamente' };
  }
}
