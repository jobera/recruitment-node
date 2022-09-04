export interface AccessToken {
  accessToken: string;
}

export interface JwtResponse {
  userId: number;
  email: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
}
