import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from 'src/common/types';
import { randomBytes } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async generateAccessToken(payload: AccessTokenPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('token.accessTokenTtl'),
      audience: this.configService.get('token.audience'),
      issuer: this.configService.get('token.issuer'),
    });
  }

  async generateRefreshToken(payload: AccessTokenPayload) {
    const randomPart = randomBytes(32).toString('hex');
    const timestamp = Date.now();
    const token = `${randomPart}.${timestamp}`;

    await this.cacheManager.set(
      token,
      payload,
      this.configService.get('token.refreshTokenTtl'),
    );

    return token;
  }
}
