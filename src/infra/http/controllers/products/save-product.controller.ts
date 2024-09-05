import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SaveProductUseCase } from '@/domain/application/use-cases/product/save-product';

const registerProductBodySchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  stock: z.number().optional(),
  collections: z.array(z.string()).optional(),
  sizes: z.array(z.enum(['xs', 's', 'm', 'l', 'xl', 'xxl'])).optional(),
  models: z.array(z.string()).optional(),
});

type RegisterProductBodySchema = z.infer<typeof registerProductBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(registerProductBodySchema);

@Controller('/product')
export class SaveProductController {
  constructor(private saveProductUseCase: SaveProductUseCase) {}

  @Put('/:id')
  @HttpCode(202)
  async handle(
    @Body(bodyValidationPipe) body: RegisterProductBodySchema,
    @Param('id') productId: string,
  ) {
    const { name, price, description, stock, collections, sizes, models } =
      body;

    const result = await this.saveProductUseCase.execute({
      id: productId,
      name,
      price,
      description,
      stock,
      collections,
      sizes,
      models,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
