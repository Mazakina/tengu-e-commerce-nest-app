import { EventHandler } from '@/core/events/event-handler';
import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/product-repository';
import { SaveProductUseCase } from '../use-cases/product/save-product';
import { DomainEvents } from '@/core/events/domain-events';
import { OnOrderCancelledEvent } from '@/domain/enterprise/events/on-order-cancelled-event';

@Injectable()
export class OnOrderCancelled implements EventHandler {
  constructor(
    private productsRepository: ProductsRepository,
    private saveProductUseCase: SaveProductUseCase,
  ) {
    this.setupSubscrption();
  }

  setupSubscrption(): void {
    DomainEvents.register(
      this.rollbackProductsFromCanceledOrder.bind(this),
      OnOrderCancelledEvent.name,
    );
  }

  private async rollbackProductsFromCanceledOrder({
    orderItems,
  }: OnOrderCancelledEvent) {
    const productsIds = orderItems.map((item) => item.productId);

    const products = await this.productsRepository.findManyById(productsIds);
    const updates = products.map((product) => {
      const orderItem = orderItems.find(
        (item) => item.productId === product.id.toString(),
      );

      if (orderItem) {
        return this.saveProductUseCase.execute({
          stock: product.stock + orderItem.quantity,
          id: product.id.toString(),
        });
      }
    });
    await Promise.all(updates);
  }
}
