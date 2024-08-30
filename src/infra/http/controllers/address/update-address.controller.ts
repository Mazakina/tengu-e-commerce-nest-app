import { EditAddressUseCase } from '@/domain/application/use-cases/address/edit-address';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

const bodySchema = z.object({
  city: z.string().optional(),
  street: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  id: z.string(),
  customerId: z.string().optional(),
  country: z.string().optional(),
});

type BodySchema = z.infer<typeof bodySchema>;

const zodValidationPipe = new ZodValidationPipe(bodySchema);

@Controller('address/')
export class UpdateAddressController {
  constructor(private editAddressUseCase: EditAddressUseCase) {}

  @Put('/:slug')
  @HttpCode(202)
  async handle(@Body(zodValidationPipe) body: BodySchema) {
    const { city, street, state, postalCode, id, customerId, country } = body;
    const result = await this.editAddressUseCase.execute({
      city,
      street,
      state,
      postalCode,
      id,
      customerId,
      country,
    });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
