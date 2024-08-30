import { RegisterCustomerUseCase } from '@/domain/application/use-cases/customer/register-customer';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/public';

const registerCustomerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type RegisterCustomerBodySchema = z.infer<typeof registerCustomerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(registerCustomerBodySchema);

@Controller('/customer/create')
export class RegisterCustomerController {
  constructor(private registerCustomerUseCase: RegisterCustomerUseCase) {}

  @Public()
  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: RegisterCustomerBodySchema) {
    const { name, email, password } = body;
    const result = await this.registerCustomerUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
