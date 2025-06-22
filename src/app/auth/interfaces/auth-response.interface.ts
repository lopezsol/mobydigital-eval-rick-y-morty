import type { User } from './user.interface';

export interface AuthResponse {
  header: {
    message: string;
    resultCode: number;
  };
  data: { user: User; token: string };
}
