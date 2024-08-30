import { DeleteAddressUseCase } from '@/domain/application/use-cases/address/delete-address';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';

@Controller('/address')
export class DeleteAddressController {
  constructor(private deleteAddressUseCase: DeleteAddressUseCase) {}

  @Delete('/:id')
  @HttpCode(202)
  async handle(@Param('id') id: string) {
    const result = await this.deleteAddressUseCase.execute(id);

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
