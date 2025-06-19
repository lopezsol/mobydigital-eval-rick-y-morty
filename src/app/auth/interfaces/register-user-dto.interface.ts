import type { Address } from './adress.interface';

export interface RegisterUserDto {
  name: string;
  mail: string;
  password: string;
  address?: Address;
  phone?: string;
  birthday?: Date;
}
