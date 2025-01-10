import { Controller, Get } from '@nestjs/common';
import { SaleService } from './sale.service';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';

@Controller('sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}

    @ApiOperation({ summary: 'Total Sale By Month'})
    @Get('by-month')
    async getTotalByMonth(){
        return await this.saleService.getTotalByMonth()
    }

    @ApiOperation({ summary: 'Total Sale'})
    @Get('total')
    async getTotal(){
            return await this.saleService.getTotal()
    }
}
