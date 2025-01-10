import { Controller, Get, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/utils/Role/role.decorator';
import { Role } from 'src/utils/Role/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}

    @ApiOperation({ summary: 'Total Sale By Month'})
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @Get('by-month')
    async getTotalByMonth(){
        return await this.saleService.getTotalByMonth()
    }

    @ApiOperation({ summary: 'Total Sale'})
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @Get('total')
    async getTotal(){
            return await this.saleService.getTotal()
    }
}
