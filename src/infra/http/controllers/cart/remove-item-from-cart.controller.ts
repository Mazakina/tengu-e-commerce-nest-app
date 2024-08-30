import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
// import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
// import { z } from 'zod';
import { RemoveItemFromCartUseCase } from '@/domain/application/use-cases/cart/remove-item-from-cart';

// const bodyValidationSchema = z.object({});

// type BodyValidationSchema = z.infer<typeof bodyValidationSchema>;

// const zodValidationPipe = new ZodValidationPipe(bodyValidationSchema);

@Controller('cart/item/delete')
export class RemoveItemFromCartController {
  constructor(private removeItemFromCartUseCase: RemoveItemFromCartUseCase) {}
  @Delete('/:id')
  @HttpCode(202)
  async handle(
    @Param('id') id: string,
    // @Body(zodValidationPipe) body: BodyValidationSchema
  ) {
    // const { userId, itemId } = body;

    const result = await this.removeItemFromCartUseCase.execute({
      cartItemId: id,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
