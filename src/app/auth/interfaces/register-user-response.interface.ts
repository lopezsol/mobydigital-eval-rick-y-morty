import type { RegisterUserDto } from './register-user-dto.interface';

export interface RegisterResponse {
  header: {
    message: string;
    resultCode: number;
  };
  data: { user: RegisterUserDto };
}
