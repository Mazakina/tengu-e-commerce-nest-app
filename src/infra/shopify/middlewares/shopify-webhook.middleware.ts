import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class ShopifyWebhookMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const hmac = req.headers['x-shopify-hmac-sha256'] as string;
    const secret = process.env.API_SECRET_KEY;

    const rawBody = JSON.stringify(req.body);
    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    if (generatedHash !== hmac) {
      throw new HttpException('Invalid HMAC signature', HttpStatus.FORBIDDEN);
    }
    next();
  }
}
