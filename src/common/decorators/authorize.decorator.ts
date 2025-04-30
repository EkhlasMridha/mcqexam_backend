import { SetMetadata } from '@nestjs/common';
import { UserPermission } from 'src/constants/permissions.constant';

export const ROLE_KEY = 'role_key';
export const Authorize = (...roles: UserPermission[]) =>
  SetMetadata(ROLE_KEY, roles);
