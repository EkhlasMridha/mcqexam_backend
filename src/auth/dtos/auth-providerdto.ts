import { AuthProviderTypes } from 'src/common/types';

export class AuthProviderDto {
  provider: AuthProviderTypes;
  authId: string;
}
