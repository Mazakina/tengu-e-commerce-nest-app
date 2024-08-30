import { FetchOrderItemByOrderIdUseCase } from '@/domain/application/use-cases/orderItem/fetch-order-item-by-order-id';
import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common';

@Controller('/order/items/:orderId')
export class FetchOrderItemByOrderIdController {
  constructor(
    private fetchOrderItemByOrderIdUseCase: FetchOrderItemByOrderIdUseCase,
  ) {}

  @Get()
  @HttpCode(202)
  async handle(id: string) {
    const result = await this.fetchOrderItemByOrderIdUseCase.execute(id);

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const orderItems = result.value;

    return orderItems;
  }
}
