import { GetCustomerUseCase } from '@/domain/application/use-cases/customer/get-customer-by-id';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { CustomerPresenter } from '../../presenters/customer.presenter';

@Controller('/customer')
export class GetCustomerController {
  constructor(private getCustomerUseCase: GetCustomerUseCase) {}

  @Get('/:slug')
  async handle(@Param('slug') slug: string) {
    const result = await this.getCustomerUseCase.execute({ customerId: slug });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { customer: CustomerPresenter.toHttp(result.value.customer) };
  }
}
