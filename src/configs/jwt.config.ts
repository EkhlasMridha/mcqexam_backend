import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenTtl: parseInt(process.env.JWT_TTL ?? '3600', 10),
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
}));
