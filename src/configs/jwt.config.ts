import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenTtl: parseInt(process.env.JWT_TTL ?? '3600', 10),
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  refreshTokenTtl: parseInt(process.env.REFRESH_TOKEN_TTL ?? '4320', 10),
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
}));
