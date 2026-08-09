export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  Result: T;
}

export interface LoginPayload {
  userName: string;
  password: string;
}

export interface LoginResult {
  authenticated: boolean;
  token: string;
}

export interface AuthUser {
  id: string;
  userName: string;
  role: string;
}
