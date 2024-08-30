import { Module } from '@nestjs/common';
import { RegisterProductController } from './controllers/products/register-product.controller';
import { DatabaseModule } from '../database/database.module';
import RegisterProductUseCase from '@/domain/application/use-cases/product/register-product';
import { DeleteProductUseCase } from '@/domain/application/use-cases/product/delete-product';
import FetchAllProductsUseCase from '@/domain/application/use-cases/product/fetch-all-products';
import { FetchProductByCollectionUseCase } from '@/domain/application/use-cases/product/fetch-product-by-collection';
import { GetProductBySlugUseCase } from '@/domain/application/use-cases/product/get-product-by-slug';
import { SaveProductUseCase } from '@/domain/application/use-cases/product/save-product';
import { CancelOrderUseCase } from '@/domain/application/use-cases/order/cancel-order';
import { ConfirmOrderUseCase } from '@/domain/application/use-cases/order/confirm-order';
import { CreateOrderUseCase } from '@/domain/application/use-cases/order/create-order';
import { DeliverOrderUseCase } from '@/domain/application/use-cases/order/deliver-order';
import { ModifyOrderUseCase } from '@/domain/application/use-cases/order/modify-order-details';
import { ShipOrderUseCase } from '@/domain/application/use-cases/order/ship-order';
import { AddItemToCartUseCase } from '@/domain/application/use-cases/cart/add-item-to-cart';
import { CleanCartUseCase } from '@/domain/application/use-cases/cart/clean-cart';
import { CreateCartUseCase } from '@/domain/application/use-cases/cart/create-cart';
import { RemoveItemFromCartUseCase } from '@/domain/application/use-cases/cart/remove-item-from-cart';
import { CreateOrderItemUseCase } from '@/domain/application/use-cases/orderItem/create-order-item';
import { GetOrderByIDUseCase } from '@/domain/application/use-cases/order/get-order-by-id';
import { CreateAddressUseCase } from '@/domain/application/use-cases/address/create-address';
import { DeleteAddressUseCase } from '@/domain/application/use-cases/address/delete-address';
import { EditAddressUseCase } from '@/domain/application/use-cases/address/edit-address';
import { FetchAddressByUserIdUseCase } from '@/domain/application/use-cases/address/fetch-address-by-user-id';
import { GetCustomerUseCase } from '@/domain/application/use-cases/customer/get-customer-by-id';
import { RegisterCustomerUseCase } from '@/domain/application/use-cases/customer/register-customer';
import { UpdateCustomerUseCase } from '@/domain/application/use-cases/customer/update-customer';
import { FetchOrderByUserIDUseCase } from '@/domain/application/use-cases/order/fetch-order-by-user-id';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { FetchOrderItemByOrderIdUseCase } from '@/domain/application/use-cases/orderItem/fetch-order-item-by-order-id';
import { GetOrderItemByIdUseCase } from '@/domain/application/use-cases/orderItem/get-order-item-by-id';
import { AuthenticateCustomerUseCase } from '@/domain/application/use-cases/customer/authenticate-customer';
import { RegisterCustomerController } from './controllers/customer/register-customer.controller';
import { CreateAddressController } from './controllers/address/create-address.controller';
import { AuthenticateCustomerController } from './controllers/customer/authenticate-customer.controller';
import { GetCustomerController } from './controllers/customer/get-customer.controller';
import { UpdateCustomerController } from './controllers/customer/update-customer.controller';
import { DeleteAddressController } from './controllers/address/delete-address.controller';
import { FetchAddressController } from './controllers/address/fetch-address-by-user-id.controller';
import { GetAddressByIdController } from './controllers/address/get-address.controller';
import { UpdateAddressController } from './controllers/address/update-address.controller';
import { FetchProductByCollectionController } from './controllers/products/fetch-product-by-collection.controller';
import { FetchAllProductsController } from './controllers/products/fetch-all-products.controller';
import { SaveProductController } from './controllers/products/save-product.controller';
import { DeleteProductController } from './controllers/products/delete-product.controller';
import { GetProductController } from './controllers/products/get-products.controller';
import { CleanCartController } from './controllers/cart/clean-cart.controller';
import { AddItemToCartController } from './controllers/cart/add-item-to-cart.controller';
import { CreateCartController } from './controllers/cart/create-cart.controller';
import { CreateOrderController } from './controllers/order/create-order.controller';
import { SubtractStockUseCase } from '@/domain/application/use-cases/product/subtract-stock';
import { CancelOrderController } from './controllers/order/cancel-order.controller';
import { GetAddressByIdUseCase } from '@/domain/application/use-cases/address/get-address-by-id';
import { DeliverOrderController } from './controllers/order/deliver-order.controller';
import { GetOrderByIdController } from './controllers/order/get-order-by-id';
import { ShipOrderController } from './controllers/order/ship-order.controller';
import { ConfirmOrderController } from './controllers/order/confirm-order.controller';
import { FetchOrderByUserIdController } from './controllers/order/fetch-order-by-user-id.controller';
import { RemoveItemFromCartController } from './controllers/cart/remove-item-from-cart.controller';
import { FetchOrderItemByOrderIdController } from './controllers/orderItem/fetch-order-item-by-order-id';
import { GetOrderItemByIdController } from './controllers/orderItem/get-order-item-by-id.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    CreateAddressUseCase,
    DeleteAddressUseCase,
    EditAddressUseCase,
    FetchAddressByUserIdUseCase,
    GetAddressByIdUseCase,

    AddItemToCartUseCase,
    CleanCartUseCase,
    CreateCartUseCase,
    RemoveItemFromCartUseCase,

    AuthenticateCustomerUseCase,
    GetCustomerUseCase,
    RegisterCustomerUseCase,
    UpdateCustomerUseCase,

    CancelOrderUseCase,
    ConfirmOrderUseCase,
    CreateOrderUseCase,
    DeliverOrderUseCase,
    FetchOrderByUserIDUseCase,
    GetOrderByIDUseCase,
    ModifyOrderUseCase,
    ShipOrderUseCase,
    CreateOrderItemUseCase,

    RegisterProductUseCase,
    DeleteProductUseCase,
    FetchAllProductsUseCase,
    FetchProductByCollectionUseCase,
    GetProductBySlugUseCase,
    SaveProductUseCase,
    CreateOrderItemUseCase,
    FetchOrderItemByOrderIdUseCase,
    GetOrderItemByIdUseCase,
    SubtractStockUseCase,
  ],
  controllers: [
    RegisterProductController,
    FetchProductByCollectionController,
    FetchAllProductsController,
    SaveProductController,
    GetProductController,
    DeleteProductController,

    AddItemToCartController,
    CleanCartController,
    CreateCartController,
    RemoveItemFromCartController,

    AuthenticateCustomerController,
    GetCustomerController,
    RegisterCustomerController,
    UpdateCustomerController,

    CreateOrderController,
    CancelOrderController,
    DeliverOrderController,
    GetOrderByIdController,
    ShipOrderController,
    ConfirmOrderController,
    FetchOrderByUserIdController,

    CreateAddressController,
    DeleteAddressController,
    FetchAddressController,
    GetAddressByIdController,
    UpdateAddressController,

    FetchOrderItemByOrderIdController,
    GetOrderItemByIdController,
  ],
})
export class HttpModule {}
