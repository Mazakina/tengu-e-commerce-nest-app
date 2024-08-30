import { CreateOrderUseCase } from '@/domain/application/use-cases/order/create-order';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { OrderPresenter } from '../../presenters/order.presenter';
import { OutOfStockError } from '@/domain/application/use-cases/errors/out-of-stock-error';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});
const createOrderBodySchema = z.object({
  id: z.string().uuid().optional(),
  items: z.array(orderItemSchema.required()),
  address: z.string().optional(),
  idempotencyKey: z.any(),
  userId: z.string(),
});
type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

@Controller('order/create')
export class CreateOrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}
  @Post()
  @HttpCode(202)
  async handle(@Body() body: CreateOrderBodySchema) {
    const { items, id, address, idempotencyKey, userId } = body;

    const itemsRequired = items.map(({ productId, quantity }) => {
      return { productId, quantity };
    });
    const result = await this.createOrderUseCase.execute({
      address,
      idempotencyKey,
      itemsDetails: itemsRequired,
      id,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case OutOfStockError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const order = result.value.order;

    return { order: OrderPresenter.toHttp(order) };
  }
}
