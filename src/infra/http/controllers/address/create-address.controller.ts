import { CreateAddressUseCase } from '@/domain/application/use-cases/address/create-address';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

const createAddressBodySchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
  customerId: z.string(),
  createdAt: z.any(),
  updatedAt: z.any(),
});

type CreateAddressBodySchema = z.infer<typeof createAddressBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createAddressBodySchema);

@Controller('/address/create')
export class CreateAddressController {
  constructor(private createAddressUseCase: CreateAddressUseCase) {}

  @Post('')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateAddressBodySchema) {
    const {
      street,
      city,
      state,
      postalCode,
      country,
      customerId,
      createdAt,
      updatedAt,
    } = body;
    const result = await this.createAddressUseCase.execute({
      street,
      city,
      state,
      postalCode,
      country,
      customerId,
      createdAt,
      updatedAt,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
