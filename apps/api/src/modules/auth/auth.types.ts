export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refreshToken?: string;
}
