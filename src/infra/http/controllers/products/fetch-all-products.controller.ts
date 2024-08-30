import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common';
import { ProductPresenter } from '../../presenters/product.presenter';
import FetchAllProductsUseCase from '@/domain/application/use-cases/product/fetch-all-products';

@Controller('/product/all')
export class FetchAllProductsController {
  constructor(private fetchAllProductsUseCase: FetchAllProductsUseCase) {}

  @Get('/:page')
  @HttpCode(202)
  async handle(@Param('page') page: number) {
    const result = await this.fetchAllProductsUseCase.execute({ page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      products: result.value.products.map((product) =>
        ProductPresenter.toHttp(product),
      ),
    };
  }
}
