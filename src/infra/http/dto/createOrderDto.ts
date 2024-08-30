import { OrderStatus } from '@/domain/enterprise/entities/order';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';

export class CreateOrderDto {
  items: OrderItem[];
  address: string;
  total: number;
  status: OrderStatus;
  idempotencyKey: string;
}
