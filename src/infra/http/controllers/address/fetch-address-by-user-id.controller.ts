import { FetchAddressByUserIdUseCase } from '@/domain/application/use-cases/address/fetch-address-by-user-id';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common';

@Controller('/user/address')
export class FetchAddressController {
  constructor(
    private fetchAddressByUserIdUseCase: FetchAddressByUserIdUseCase,
  ) {}

  @Get('/:slug')
  @HttpCode(202)
  async handle(@Param('slug') slug: string) {
    const result = await this.fetchAddressByUserIdUseCase.execute(slug);

    if (result.isLeft()) {
      throw new BadRequestException();
    }
    return { address: result.value };
  }
}
