import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/dtos/createOrderDto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'New Order' })
  @Post()
  newOrder(@Body() createOrderDto: CreateOrderDto): Promise<{url: string}> {
    return this.orderService.createOrder(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all Orders' })
  @Get('orders')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @ApiOperation({ summary: 'Get Order By Id' })
  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @ApiOperation({ summary: 'Delete Order' })
  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }

  @ApiOperation({ summary: 'Get Order By User'})
  @Get('user/:id')
  getOrderByUser(@Param('userId') userId: string){
    return this.orderService.getOrderUserId(userId)
  }
}
