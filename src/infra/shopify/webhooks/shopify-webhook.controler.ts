import { DeleteProductUseCase } from '@/domain/application/use-cases/product/delete-product';
import RegisterProductUseCase from '@/domain/application/use-cases/product/register-product';
import { SaveProductUseCase } from '@/domain/application/use-cases/product/save-product';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
} from '@nestjs/common';

@Controller('shopify/webhook')
export class ShopifyWebhookController {
  constructor(
    private registerProduct: RegisterProductUseCase,
    private deleteProduct: DeleteProductUseCase,
    private saveProductUseCase: SaveProductUseCase,
  ) {}

  @Post('products/create')
  async handleProductCreate(@Body() productData: any) {
    const { id, title, variants, description, options, collections } =
      productData;
    const { price, inventory_quantity } = variants[0];
    const sizes = options[0].optionValues[0].sizes;
    const result = await this.registerProduct.execute({
      name: title,
      stock: inventory_quantity,
      price,
      description,
      id,
      sizes: sizes,
      collections,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }

  @Post('products/update')
  async handleProductUpdate(@Body() productData: any) {
    const { id, title, variants, description, options, collections } =
      productData;
    const { price, inventory_quantity } = variants[0];
    const sizes = options[0].optionValues[0].sizes;
    const result = await this.saveProductUseCase.execute({
      name: title,
      stock: inventory_quantity,
      price,
      description,
      id,
      sizes: sizes,
      collections,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }

  @Delete('products')
  async handleProductDelete(@Body() productData: { id: string }) {
    const { id } = productData;
    const result = await this.deleteProduct.execute(id);

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
