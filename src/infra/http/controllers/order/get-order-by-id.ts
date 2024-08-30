import { GetOrderByIDUseCase } from '@/domain/application/use-cases/order/get-order-by-id';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { OrderPresenter } from '../../presenters/order.presenter';

@Controller('/order')
export class GetOrderByIdController {
  constructor(private getOrderByIdUseCase: GetOrderByIDUseCase) {}

  @Get('/:orderId')
  async handle(@Param('orderId') orderId: string) {
    const result = await this.getOrderByIdUseCase.execute(orderId);

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const order = result.value.order;

    return { order: OrderPresenter.toHttp(order) };
  }
}
