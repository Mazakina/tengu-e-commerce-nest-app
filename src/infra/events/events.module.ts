import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OnOrderCreated } from '@/domain/application/subscribers/on-order-created';
import { SubtractStockUseCase } from '@/domain/application/use-cases/product/subtract-stock';
import { OnOrderCancelled } from '@/domain/application/subscribers/on-order-cancelled';
import { SaveProductUseCase } from '@/domain/application/use-cases/product/save-product';

@Module({
  imports: [DatabaseModule],
  providers: [
    OnOrderCreated,
    OnOrderCancelled,
    SaveProductUseCase,
    SubtractStockUseCase,
  ],
})
export class EventsModule {}
