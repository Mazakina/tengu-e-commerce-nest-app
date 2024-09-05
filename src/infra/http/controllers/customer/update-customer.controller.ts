import { UpdateCustomerUseCase } from '@/domain/application/use-cases/customer/update-customer';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';

const updateCustomerBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});

type UpdateCustomerBodySchema = z.infer<typeof updateCustomerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(updateCustomerBodySchema);

@Controller('/customer')
export class UpdateCustomerController {
  constructor(private updateCustomerUseCase: UpdateCustomerUseCase) {}

  @Patch('/:slug')
  async handle(
    @Param('slug') slug: string,
    @Body(bodyValidationPipe) body: UpdateCustomerBodySchema,
  ) {
    const { name, email, password } = body;
    const result = await this.updateCustomerUseCase.execute({
      name,
      email,
      password,
      customerId: slug,
    });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
