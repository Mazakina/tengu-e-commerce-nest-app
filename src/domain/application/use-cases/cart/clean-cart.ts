import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from '../../repositories/cart-repository';
import { Either, left, right } from '@/core/either';

type CleanCartUseCaseResponse = Either<NotFoundException, void>;

@Injectable()
export class CleanCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute({
    cartId,
  }: {
    cartId: string;
  }): Promise<CleanCartUseCaseResponse> {
    const cart = await this.cartRepository.findByID(cartId);
    if (!cart) {
      return left(new NotFoundException());
    }
    cart.clearItems();
    await this.cartRepository.clean(cart.id.toString());
    return right(null);
  }
}
