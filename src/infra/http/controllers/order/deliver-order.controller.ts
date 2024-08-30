import { DeliverOrderUseCase } from '@/domain/application/use-cases/order/deliver-order';
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { OrderPresenter } from '../../presenters/order.presenter';

@Controller('/order/deliver')
export class DeliverOrderController {
  constructor(private deliverOrderUseCase: DeliverOrderUseCase) {}

  @Patch('/:id')
  @HttpCode(200)
  async handle(@Param('id') orderId: string) {
    const result = await this.deliverOrderUseCase.execute(orderId);
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const order = result.value.order;

    return { order: OrderPresenter.toHttp(order) };
  }
}
