export interface IShopifyService {
  getProduct(id: string): Promise<any>;
  findAll(): Promise<any>;
}
