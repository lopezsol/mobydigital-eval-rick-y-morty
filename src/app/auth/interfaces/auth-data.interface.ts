import type { User } from "./user.interface";

export interface AuthData {
  user:  User;
  token: string;
}