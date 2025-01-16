import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/utils/orderStatus.enum';


export class UpdateOrderStatusManualDto {
  @ApiProperty({ 
    enum: OrderStatus, 
    description: 'Nuevo estado de la orden',
    example: { "newStatus": "ON_THE_WAY" }
 })
  @IsEnum(OrderStatus)
  newStatus: OrderStatus;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    enum: OrderStatus, 
    description: 'Estado de la orden',
    example: { "newStatus": "IN_PREPARATION" }
 })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
