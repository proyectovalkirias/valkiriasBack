import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Sale } from 'src/entities/sale.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class SaleService {
    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
    ) {}

    async getTotalByMonth() {
        return await this.saleRepository
        .createQueryBuilder('sale')
        .select("TO_CHAR(sale.date, 'YYYY-MM)", 'month')
        .addSelect('COUNT(*)', 'totalSales')
        .groupBy("TO_CHAR(sale.date, 'YYYY-MM')")
        .orderBy('month', 'ASC')
        .getRawMany();
    }

    async getTotal() {
        return await this.saleRepository
         .createQueryBuilder('sale')
         .select('SUM(sale.quantity * sale.priceUnit)', 'total')
         .getRawOne();
    }
}
