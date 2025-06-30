import type { User } from '@auth/interfaces/user.interface';

export interface UpdateUserResponse {
  header: {
    message: string;
    resultCode: number;
  };
  data: { user: User };
}
