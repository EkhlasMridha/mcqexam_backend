import { SetMetadata } from '@nestjs/common';
import { PUBLIC_META } from 'src/constants/permissions.constant';

export const Public = () => SetMetadata(PUBLIC_META, true);
