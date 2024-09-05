import { AddItemToCartUseCase } from '@/domain/application/use-cases/cart/add-item-to-cart';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';

const bodyValidationSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().min(1),
});

type BodyValidationSchema = z.infer<typeof bodyValidationSchema>;

const zodValidationPipe = new ZodValidationPipe(bodyValidationSchema);

@Controller('/cart/item')
export class AddItemToCartController {
  constructor(private addItemToCartUseCase: AddItemToCartUseCase) {}

  @Put()
  @HttpCode(202)
  async handle(@Body(zodValidationPipe) body: BodyValidationSchema) {
    const { userId, productId, quantity } = body;

    const result = await this.addItemToCartUseCase.execute({
      userId,
      productId,
      quantity,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
