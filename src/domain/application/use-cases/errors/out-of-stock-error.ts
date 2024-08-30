import { UseCaseError } from '@/core/errors/use-case-error';

export class OutOfStockError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`product ${identifier} has not enought stock.`);
  }
}
