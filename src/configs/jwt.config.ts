import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtTTL: process.env.JWT_TTL,
}));
