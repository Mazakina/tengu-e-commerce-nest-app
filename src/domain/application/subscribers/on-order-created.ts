import { DomainEvents } from '@/core/events/domain-events';
import { ProductsRepository } from '../repositories/product-repository';
import { OnOrderCreatedEvent } from '@/domain/enterprise/events/on-order-created-event';
import { EventHandler } from '@/core/events/event-handler';
import { SubtractStockUseCase } from '../use-cases/product/subtract-stock';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnOrderCreated implements EventHandler {
  constructor(
    private productsRepository: ProductsRepository,
    private subtractProductUseCase: SubtractStockUseCase,
  ) {
    this.setupSubscrption();
  }

  setupSubscrption(): void {
    DomainEvents.register(
      this.subtractProductFromStock.bind(this),
      OnOrderCreatedEvent.name,
    );
  }

  private async subtractProductFromStock({ orderItems }: OnOrderCreatedEvent) {
    const productsIds = orderItems.map((item) => item.productId);
    const products = await this.productsRepository.findManyById(productsIds);

    const updates = [];
    for (const { productId, quantity } of orderItems) {
      const product = products.find((item) => item.id.toString());

      if (product) {
        updates.push(
          this.subtractProductUseCase.execute({
            productId: productId,
            valuetoSubtract: quantity,
          }),
        );
      }
    }

    await Promise.all(updates);
  }
}
