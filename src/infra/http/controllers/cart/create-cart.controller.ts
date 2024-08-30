import { CreateCartUseCase } from '@/domain/application/use-cases/cart/create-cart';
import { Controller, HttpCode, Param, Post } from '@nestjs/common';

@Controller('/cart/create')
export class CreateCartController {
  constructor(private createCartUseCase: CreateCartUseCase) {}

  @Post('/:userId')
  @HttpCode(201)
  async handle(@Param('userId') userId: string) {
    await this.createCartUseCase.execute({ userId });
  }
}
