import { Controller, Get, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @ApiOperation({ summary: 'Total Sale By Month' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, RoleGuard)
  @Get('by-month')
  async getTotalByMonth() {
    return await this.saleService.getTotalByMonth();
  }

  @ApiOperation({ summary: 'Total Sale' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, RoleGuard)
  @Get('total')
  async getTotal() {
    return await this.saleService.getTotal();
  }
}
