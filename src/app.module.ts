import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './infra/app.controller';
import { HttpModule } from './infra/http/http.module';
import { envSchema } from './infra/env/env';
import { ShopifyModule } from './infra/shopify/shopify.module';
import { EnvModule } from './infra/env/env.module';
import { AuthModule } from './infra/auth/auth.module';
import { EventsModule } from './infra/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    HttpModule,
    ShopifyModule,
    EventsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
