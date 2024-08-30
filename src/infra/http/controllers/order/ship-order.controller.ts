import { ShipOrderUseCase } from '@/domain/application/use-cases/order/ship-order';
import { BadRequestException, Controller, Param, Patch } from '@nestjs/common';
import { OrderPresenter } from '../../presenters/order.presenter';

@Controller('order/ship/:orderId')
export class ShipOrderController {
  constructor(private shipOrderUseCase: ShipOrderUseCase) {}

  @Patch()
  async handle(@Param('orderId') orderId: string) {
    const result = await this.shipOrderUseCase.execute({ orderId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { order } = result.value;

    return { order: OrderPresenter.toHttp(order) };
  }
}
