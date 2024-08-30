import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ShopifyGraphQLService } from './shopify-graphql.service';
import { ShopifyWebhookController } from './webhooks/shopify-webhook.controler';
import { EnvModule } from '../env/env.module';
import { DatabaseModule } from '../database/database.module';
import RegisterProductUseCase from '@/domain/application/use-cases/product/register-product';
import { ShopifyWebhookMiddleware } from './middlewares/shopify-webhook.middleware';
import { SaveProductUseCase } from '@/domain/application/use-cases/product/save-product';
import { DeleteProductUseCase } from '@/domain/application/use-cases/product/delete-product';

@Module({
  imports: [EnvModule, DatabaseModule],
  providers: [
    ShopifyGraphQLService,
    RegisterProductUseCase,
    DeleteProductUseCase,
    SaveProductUseCase,
  ],
  controllers: [ShopifyWebhookController],
})
export class ShopifyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ShopifyWebhookMiddleware)
      .forRoutes({ path: 'shopify/webhook/*', method: RequestMethod.POST });
  }
}
