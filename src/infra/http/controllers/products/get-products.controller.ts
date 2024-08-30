import { GetProductBySlugUseCase } from '@/domain/application/use-cases/product/get-product-by-slug';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common';
import { ProductPresenter } from '../../presenters/product.presenter';

@Controller('/product/:productId')
export class GetProductController {
  constructor(private getProductBySlugUseCase: GetProductBySlugUseCase) {}

  @HttpCode(200)
  @Get()
  async handle(@Param('productId') productId: string) {
    const result = await this.getProductBySlugUseCase.execute({
      slug: productId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { product: ProductPresenter.toHttp(result.value.product) };
  }
}
