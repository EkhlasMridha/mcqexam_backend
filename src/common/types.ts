export interface AccessTokenPayload {
  usr: string;
  email: string;
  aut: number;
  iv: string;
}

export type AuthProviderTypes = 'google';
