import { Injectable } from '@nestjs/common';
import { IShopifyService } from './shopify.interface';
import { EnvSchemaType } from '../env/env';
import { ConfigService } from '@nestjs/config';
import {
  AdminApiClient,
  ClientResponse,
  createAdminApiClient,
} from '@shopify/admin-api-client';
import { Either, left, right } from '@/core/either';
import { GET_PRODUCT_QUERY } from './queries/get-product';
import { FETCH_PRODUCT_QUERY } from './queries/fetch-all-products';

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  price: number;
}

type ShopifyServiceResponse = Either<Error, ClientResponse<any>>;

@Injectable()
export class ShopifyGraphQLService implements IShopifyService {
  private readonly client: AdminApiClient;

  constructor(config: ConfigService<EnvSchemaType, true>) {
    this.client = createAdminApiClient({
      storeDomain: `${config.get('SHOPIFY_SHOP_NAME')}.myshopify.com`,
      apiVersion: '2023-04',
      accessToken: config.get('API_KEY'),
    });
  }

  async getProduct(id: string): Promise<ShopifyServiceResponse> {
    const product = await this.client.request(GET_PRODUCT_QUERY, {
      variables: {
        id: `gid://shopify/Product/${id}`,
      },
    });
    if (!product.errors) {
      return right(product);
    }
    return left(new Error());
  }

  async findAll(): Promise<ShopifyServiceResponse> {
    const products = await this.client.request(FETCH_PRODUCT_QUERY); // Ajuste de acordo com seu esquema de banco de dados
    if (!products.errors) {
      return right(products.data);
    }
    return left(new Error());
  }
}
