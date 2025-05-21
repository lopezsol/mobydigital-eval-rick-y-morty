import type { Address } from './adress.interface';

export interface User {
  name: string;
  mail: string;
  password: string;
  address?: Address;
  phone?: string;
  birthday?: Date;
}
