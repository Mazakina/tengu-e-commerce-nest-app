import { HashComparer } from '@/domain/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/application/cryptography/hash-generator';
import { hash, compare } from 'bcryptjs';

export class BcryptHasher implements HashComparer, HashGenerator {
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
  private HASH_SALT_LENGHT = 8;

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGHT);
  }
}
