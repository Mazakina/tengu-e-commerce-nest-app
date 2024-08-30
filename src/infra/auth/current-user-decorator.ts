import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    console.log('userAuthDecorator');
    const request = context.switchToHttp().getRequest();

    return request.user as UserPayload;
  },
);
