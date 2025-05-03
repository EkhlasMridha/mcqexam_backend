import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AccessTokenPayload } from 'src/common/types';
import jwtConfig from 'src/configs/jwt.config';
import { UserService } from 'src/user/services/user.service';
import { uuidv7 } from 'uuidv7';
import { TokenService } from './token.service';
import { AuthToken } from '../dtos/auth-token';

@Injectable()
export class OAuthService implements OnModuleInit {
  private oAuthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;

    this.oAuthClient = new OAuth2Client({
      clientId: clientId,
      clientSecret: clientSecret,
    });
  }

  async googleAuthenticate(authToken: string) {
    const loginTicket = await this.oAuthClient.verifyIdToken({
      idToken: authToken,
    });

    const {
      email = '',
      family_name = '',
      given_name = '',
      sub: googleId,
    } = loginTicket.getPayload() || {};

    if (!googleId || !email) throw new UnauthorizedException('invalid_token');

    let user = await this.userService.findUserByAuthProviderId(googleId);

    if (!user) {
      user = await this.userService.addProviderOrCreateUser({
        userData: {
          email: email,
          firstName: family_name,
          lastName: given_name,
          password: '',
          authProviderId: googleId,
        },
      });
    }

    const tokenId = uuidv7();
    const payload: AccessTokenPayload = {
      usr: user?.id,
      email: user?.email!,
      aut: user?.permissionLevel!,
      iv: tokenId,
    };

    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);

    return new AuthToken(accessToken, refreshToken);
  }
}
