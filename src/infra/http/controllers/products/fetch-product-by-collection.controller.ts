import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ProductPresenter } from '../../presenters/product.presenter';
import { FetchProductByCollectionUseCase } from '@/domain/application/use-cases/product/fetch-product-by-collection';

@Controller('/product/collections')
export class FetchProductByCollectionController {
  constructor(
    private fetchProductByCollectionUseCase: FetchProductByCollectionUseCase,
  ) {}

  @Get('/:collectionId/:page')
  async handle(
    @Param('collectionId') collectionId: string,
    @Param('page') page: number,
  ) {
    const result = await this.fetchProductByCollectionUseCase.execute({
      collection: collectionId,
      page,
    });

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
