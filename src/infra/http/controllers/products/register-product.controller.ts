import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import RegisterProductUseCase from '@/domain/application/use-cases/product/register-product';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

const registerProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  stock: z.number(),
  collections: z.array(z.string()),
  sizes: z.array(z.enum(['xs', 's', 'm', 'l', 'xl', 'xxl'])),
  models: z.array(z.string()),
});

type RegisterProductBodySchema = z.infer<typeof registerProductBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(registerProductBodySchema);

@Controller('/product')
export class RegisterProductController {
  constructor(private registerProductUseCase: RegisterProductUseCase) {}

  @Post('')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: RegisterProductBodySchema) {
    const { name, price, description, stock, collections, sizes, models } =
      body;
    const result = await this.registerProductUseCase.execute({
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
