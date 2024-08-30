import { CancelOrderUseCase } from '@/domain/application/use-cases/order/cancel-order';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { OrderPresenter } from '../../presenters/order.presenter';

@Controller('/order/cancel')
export class CancelOrderController {
  constructor(private cancelOrderUseCase: CancelOrderUseCase) {}

  @Delete('/:orderId')
  @HttpCode(200)
  async handle(@Param('orderId') orderId: string) {
    const result = await this.cancelOrderUseCase.execute({ orderId });
    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { order: OrderPresenter.toHttp(result.value.order) };
  }
}
