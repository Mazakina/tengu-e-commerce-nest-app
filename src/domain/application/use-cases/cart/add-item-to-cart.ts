import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from '../../repositories/cart-repository';
import { Either, left, right } from '@/core/either';
import { CustomerRepository } from '../../repositories/customer-repository';
import { Cart } from '@/domain/enterprise/entities/cart';
import { CartItem } from '@/domain/enterprise/entities/cartItem';
import { CartItemRepository } from '../../repositories/cart-item-repository';
import { UniqueEntityID } from '@/core/primitives/unique-entity-id';

interface AddItemToCartUseCaseRequest {
  userId: string;
  itemId: string;
  quantity: number;
}

type AddItemToCartUseCaseResponse = Either<Error, void>;

@Injectable()
export class AddItemToCartUseCase {
  constructor(
    private cartRepository: CartRepository,
    private customerRepository: CustomerRepository,
    private cartItemRepository: CartItemRepository,
  ) {}

  async execute({
    userId,
    itemId,
    quantity,
  }: AddItemToCartUseCaseRequest): Promise<AddItemToCartUseCaseResponse> {
    const user = await this.customerRepository.findByID(userId);
    const cart = await this.cartRepository.findByUserID(userId);

    if (!user) {
      return left(new NotFoundException());
    }

    if (!cart) {
      const newCart = Cart.create({
        userId: user.id.toString(),
        items: [],
      });

      await this.cartRepository.create(newCart);

      const item = CartItem.create({
        cartId: newCart.id.toString(),
        productId: itemId,
        quantity,
      });

      await this.cartItemRepository.create(item);

      return right(null);
    }

    const alreadyExistInCart = cart.items.find(
      (value) => value.productId === itemId,
    );

    const total = alreadyExistInCart
      ? quantity + alreadyExistInCart.quantity
      : quantity;

    const item = CartItem.create(
      {
        cartId: cart.id.toString(),
        productId: itemId,
        quantity: total,
      },
      new UniqueEntityID(alreadyExistInCart?.id.toString()),
    );
    await this.cartItemRepository.update(item);

    return right(null);
  }
}
