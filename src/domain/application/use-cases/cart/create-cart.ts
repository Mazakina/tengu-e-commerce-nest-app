import { Cart, CartProps } from '@/domain/enterprise/entities/cart';
import { CartRepository } from '../../repositories/cart-repository';
import { Either, left, right } from '@/core/either';
import { BadRequestException, Injectable } from '@nestjs/common';

type enumStatus = CartProps['status'];

type CreateCartUseCaseRequest = {
  status?: enumStatus;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
};

type CreateCartUseCaseResponse = Either<BadRequestException, { cart: Cart }>;

@Injectable()
export class CreateCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute({
    status,
    createdAt,
    updatedAt,
    userId,
  }: CreateCartUseCaseRequest): Promise<CreateCartUseCaseResponse> {
    const cartAlreadyExist = await this.cartRepository.findByUserID(userId);
    if (cartAlreadyExist) {
      return left(new BadRequestException());
    }
    const cart = Cart.create({
      items: [],
      status,
      createdAt,
      updatedAt,
      userId,
    });
    await this.cartRepository.create(cart);

    return right({ cart });
  }
}
