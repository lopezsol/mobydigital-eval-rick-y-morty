import type { Header } from "./header.interface";
import type { RegisterData } from "./register-data.interface";

export interface RegisterResponse {
    header: Header;
    data:   RegisterData;
}


