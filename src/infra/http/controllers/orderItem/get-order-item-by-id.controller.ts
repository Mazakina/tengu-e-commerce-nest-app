import { GetOrderItemByIdUseCase } from '@/domain/application/use-cases/orderItem/get-order-item-by-id';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

@Controller('/order/item/:id')
export class GetOrderItemByIdController {
  constructor(private getOrderItemByIdUseCase: GetOrderItemByIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getOrderItemByIdUseCase.execute(id);

    if (result.isLeft()) {
      throw new NotFoundException();
    }

    const orderItem = result.value;

    return orderItem;
  }
}
