import { ConfirmOrderUseCase } from '@/domain/application/use-cases/order/confirm-order';
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { OrderPresenter } from '../../presenters/order.presenter';

@Controller('/order/confirm')
export class ConfirmOrderController {
  constructor(private confirmOrderUseCase: ConfirmOrderUseCase) {}

  @Patch('/:orderId')
  @HttpCode(200)
  async handle(@Param('orderId') orderId: string) {
    const result = await this.confirmOrderUseCase.execute({ orderId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const order = result.value.order;
    return { order: OrderPresenter.toHttp(order) };
  }
}
