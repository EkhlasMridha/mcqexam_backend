import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from 'src/common/types';
import { randomBytes } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheService } from 'src/common/services/cache.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {}

  async generateAccessToken(payload: AccessTokenPayload) {
    await this.cacheService.setData(
      payload.iv,
      payload.iv,
      this.configService.get('token.accessTokenTtl'),
    );

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

    await this.cacheService.setData(
      token,
      payload,
      this.configService.get('token.refreshTokenTtl'),
    );

    return token;
  }
}
