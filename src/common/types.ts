export interface AccessTokenPayload {
  usr: string;
  email: string;
  aut: number;
  iv: string;
  oid?: string | null;
}

export type AuthProviderTypes = 'google';
export type ExamType = 'sequantial' | 'rounded';
