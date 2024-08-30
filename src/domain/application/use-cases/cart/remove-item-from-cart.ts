import { Injectable, NotFoundException } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { CartItemRepository } from '../../repositories/cart-item-repository';

interface RemoveItemFromCartUseCaseRequest {
  cartItemId: string;
}

type RemoveItemFromCartUseCaseResponse = Either<Error, void>;

@Injectable()
export class RemoveItemFromCartUseCase {
  constructor(private cartItemRepository: CartItemRepository) {}

  async execute(
    props: RemoveItemFromCartUseCaseRequest,
  ): Promise<RemoveItemFromCartUseCaseResponse> {
    const orderItem = await this.cartItemRepository.get(props.cartItemId);

    if (!orderItem) {
      return left(new NotFoundException());
    }
    await this.cartItemRepository.delete(props.cartItemId);
    return right(null);
  }
}
