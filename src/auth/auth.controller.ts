import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninDto } from './dtos/signin-dto';
import { UserDto } from 'src/user/dtos/userDto';
import { AuthService } from './services/auth.service';
import { plainToInstance } from 'class-transformer';
import { ApiBody } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenDto } from './dtos/refresh-token-dto';
import { AuthToken } from './dtos/auth-token';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AccessTokenPayload } from 'src/common/types';
import { OAuthTokenDto } from './dtos/o-auth-token-dto';
import { OAuthService } from './services/o-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private oAuthService: OAuthService,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SigninDto })
  @Public()
  async signInUser(@Body() singinDto: SigninDto) {
    const result = await this.authService.signInUser(singinDto);

    return plainToInstance(AuthToken, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post('admin/signup')
  @ApiBody({ type: UserDto })
  @Public()
  async signUpAdmin(@Body() userDto: UserDto) {
    const result = await this.authService.signUpAdmin(userDto);

    return plainToInstance(UserDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post('refresh')
  @ApiBody({ type: RefreshTokenDto })
  @HttpCode(HttpStatus.OK)
  @Public()
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    const result = await this.authService.rotateAccessTokenByRefreshToken(
      refreshToken.refresh_token,
    );
    if (!result) throw new UnauthorizedException('refresh_error');

    return plainToInstance(AuthToken, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post('signout')
  @ApiBody({ type: RefreshTokenDto })
  @HttpCode(HttpStatus.OK)
  async signoutUser(
    @CurrentUser() userInfo: AccessTokenPayload,
    @Body() refreshToken: RefreshTokenDto,
  ) {
    await this.authService.signOutUser(userInfo, refreshToken.refresh_token);

    return true;
  }

  @Post('oauth')
  @ApiBody({ type: OAuthTokenDto })
  @HttpCode(HttpStatus.OK)
  @Public()
  async verifyOAuthTokenAndSignIn(@Body() oauthToken: OAuthTokenDto) {
    const result = await this.oAuthService.googleAuthenticate(
      oauthToken.authToken,
    );

    return plainToInstance(AuthToken, result, {
      excludeExtraneousValues: true,
    });
  }
}
