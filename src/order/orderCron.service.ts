import { Injectable, Logger } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { OrderStatus } from "src/utils/orderStatus.enum";

@Injectable()
export class OrderCronService {
    private readonly logger = new Logger(OrderCronService.name);

    constructor(private readonly orderService: OrderService){}

    @Cron(CronExpression.EVERY_10_MINUTES)
    async handleOrderStatus() {

        this.logger.log(' Order status update...');

        const orders = await this.orderService.getOrderStatus();
        for(const order of orders) {
            const nextSatus = this.getNextStatus(order.status);
            if(nextSatus) {
                this.logger.log(`Updating order ${order.id} to status ${nextSatus}`);
                await this.orderService.updateOrderStatus(order.id, nextSatus)
            }
        }

    
    }
    getNextStatus(currentStatus: string) {
        const statusFlow = {
            pendiente: OrderStatus.IN_PREPARATION,
            'en preparación': OrderStatus.ON_THE_WAY,
            'en camino': OrderStatus.DELIVERED,
        };
       
        return statusFlow[currentStatus] || null;
    }
}
