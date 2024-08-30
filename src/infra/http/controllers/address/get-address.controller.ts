import { GetAddressByIdUseCase } from '@/domain/application/use-cases/address/get-address-by-id';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common';

@Controller()
export class GetAddressByIdController {
  constructor(private getAddressByIdUseCase: GetAddressByIdUseCase) {}

  @HttpCode(202)
  @Get('address/:id')
  async handle(@Param('id') id: string) {
    const result = await this.getAddressByIdUseCase.execute({ id: id });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return result.value;
  }
}
