import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/dtos/createOrderDto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @ApiOperation({ summary: 'New Order'})
    @Post()
    newOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(createOrderDto);
    }
    
    @ApiOperation({ summary: 'Get all Orders'})
    @Get('orders')
    getAllOrders(){
        return this.orderService.getAllOrders();
    }
    
    @ApiOperation({summary: 'Get Order By Id'})
    @Get(':id')
    getOrderById(@Param('id') id: string) {
        return this.orderService.getOrder(id);
    }

    @ApiOperation({ summary: 'Delete Order'})
    @Delete(':id')
    deleteOrder(@Param('id') id: string) {
        return this.orderService.deleteOrder(id)
    }

}
