import { AuthenticateCustomerUseCase } from '@/domain/application/use-cases/customer/authenticate-customer';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { WrongCredentialsError } from '@/domain/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

const zodValidationPipe = new ZodValidationPipe(authenticateBodySchema);

@Controller('sessions')
export class AuthenticateCustomerController {
  constructor(
    private authenticateCustomerUseCase: AuthenticateCustomerUseCase,
  ) {}

  @Public()
  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) { email, password }: AuthenticateBodySchema,
  ) {
    const result = await this.authenticateCustomerUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException();
        default:
          throw new BadRequestException();
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
