import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CacheService } from 'src/common/services/cache.service';
import { AccessTokenPayload } from 'src/common/types';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('token.secret')!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: AccessTokenPayload) {
    const storedTokenId = await this.cacheService.getData<string>(payload.iv);
    if (!storedTokenId) return null;

    return payload;
  }
}
