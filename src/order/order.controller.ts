import {
  Body,
  Controller,
  Delete,
  Get,
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
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'New Order' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, GoogleAuthGuard)
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
  @UseGuards(AuthGuard, GoogleAuthGuard)
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
}
