import { FetchOrderByUserIDUseCase } from '@/domain/application/use-cases/order/fetch-order-by-user-id';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { OrderPresenter } from '../../presenters/order.presenter';

@Controller('/user/order/:userId')
export class FetchOrderByUserIdController {
  constructor(private fetchOrderByUserIdUseCase: FetchOrderByUserIDUseCase) {}

  @Get()
  async handle(@Param('userId') userId: string) {
    const result = await this.fetchOrderByUserIdUseCase.execute(userId);

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const orders = result.value.orders.map((order) =>
      OrderPresenter.toHttp(order),
    );

    return { orders };
  }
}
