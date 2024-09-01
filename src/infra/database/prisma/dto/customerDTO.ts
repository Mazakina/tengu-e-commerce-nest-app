import { AddressDTO } from './addressDTO';

export class CacheCustomerDTO {
  props: {
    email: string;
    name: string;
    password: string;
    address?: AddressDTO[];
  };
  _id: { value: string };
}
