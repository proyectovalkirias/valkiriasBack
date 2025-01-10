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
import { ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/dtos/createOrderDto';
import { OrderStatus } from 'src/utils/orderStatus.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/utils/Role/role.decorator';
import { Role } from 'src/utils/Role/role.enum';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'New Order' })
  /* @UseGuards(AuthGuard, GoogleAuthGuard) */
  @Post()
  newOrder(@Body() createOrderDto: CreateOrderDto): Promise<{ url: string }> {
    return this.orderService.createOrder(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all Orders' })
  /* @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard) */
  @Get('orders')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @ApiOperation({ summary: 'Get Order By Id' })
  /* @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard) */
  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @ApiOperation({ summary: 'Delete Order' })
  /* @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard) */
  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }

  @ApiOperation({ summary: 'Get Order By User' })
  /* @UseGuards(AuthGuard, GoogleAuthGuard) */
  @Get('user/:id')
  getOrderByUser(@Param('userId') userId: string) {
    return this.orderService.getOrderUserId(userId);
  }

  @ApiOperation({ summary: 'Order Status' })
  /* @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard) */
  @Put(':id/status')
  async updateStatus(
    @Param('id') orderId: string,
    @Body() newStatus: OrderStatus,
  ) {
    if (!Object.values(OrderStatus).includes(newStatus)) {
      throw new Error('Invalid status');
    }
    return this.orderService.updateOrderStatusManual(orderId, newStatus);
  }
}
