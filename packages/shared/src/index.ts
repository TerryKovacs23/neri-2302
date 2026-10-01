export interface RegisterUserRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisteredUser {
  id: string;
  fullName: string;
  email: string;
  balance: number;
  createdAt: string;
}

export interface RegisterUserResponse {
  user: RegisteredUser;
}

export interface ApiErrorResponse {
  message: string;
}

export interface StoredUser extends RegisteredUser {
  password: string;
}
