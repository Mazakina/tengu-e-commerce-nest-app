import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('app')
export class AppController {
  constructor() {}

  @Get('hello')
  @HttpCode(201)
  async getHello() {
    return 'hello';
  }
}
