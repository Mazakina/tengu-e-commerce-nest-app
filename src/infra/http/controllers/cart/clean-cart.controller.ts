import { CleanCartUseCase } from '@/domain/application/use-cases/cart/clean-cart';
import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';

@Controller()
export class CleanCartController {
  constructor(private cleanCartUseCase: CleanCartUseCase) {}

  @Delete('/cart/clean/:id')
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const result = await this.cleanCartUseCase.execute({ cartId: id });
    if (result.isLeft()) {
      throw new NotFoundException();
    }
  }
}
