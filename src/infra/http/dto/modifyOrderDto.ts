import { OrderStatus } from '@/domain/enterprise/entities/order';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';

export class ModifyOrderDto {
  id: string;
  items: OrderItem[];
  address: string;
  total: number;
  status: OrderStatus;
  idempotencyKey: string;
}
