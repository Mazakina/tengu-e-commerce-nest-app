import { OrderItemRepository } from '@/domain/application/repositories/order-item-repository';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';

export class InMemoryOrderItemRepository implements OrderItemRepository {
  public items: OrderItem[] = [];

  async create(orderItem: OrderItem): Promise<void> {
    this.items.push(orderItem);
  }
  async getOrderItemById(id: string): Promise<OrderItem> {
    const index = this.items.findIndex((item) => item.id.toString() === id);

    return this.items[index];
  }
  async fetchOrderItemByOrderId(id: string): Promise<OrderItem[]> {
    const items = this.items.filter((item) => item.orderId === id);

    return items;
  }
}
