import { DeleteProductUseCase } from '@/domain/application/use-cases/product/delete-product';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';

@Controller('/product')
export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  @Delete('/:slug')
  @HttpCode(202)
  async handle(@Param('slug') slug: string) {
    const result = await this.deleteProductUseCase.execute(slug);

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
