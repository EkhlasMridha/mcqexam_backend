import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { AccessTokenPayload } from 'src/common/types';
import { UserDto } from 'src/user/dtos/userDto';
import { AuthToken } from './dtos/auth-token';
import { OAuthCodeDto } from './dtos/o-auth-token-dto';
import { RefreshTokenDto } from './dtos/refresh-token-dto';
import { SigninDto } from './dtos/signin-dto';
import { AuthService } from './services/auth.service';
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
  async rotateTokenByRefreshToken(@Body() refreshToken: RefreshTokenDto) {
    console.log('PL: ', refreshToken);
    const result = await this.authService.rotateAccessTokenByRefreshToken(
      refreshToken.refreshToken,
    );
    if (!result) throw new UnauthorizedException('refresh_error');

    return plainToInstance(AuthToken, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post('signout')
  @ApiBody({ type: RefreshTokenDto })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  async signoutUser(
    @CurrentUser() userInfo: AccessTokenPayload,
    @Body() refreshToken: RefreshTokenDto,
  ) {
    await this.authService.signOutUser(userInfo, refreshToken.refreshToken);

    return true;
  }

  @Post('google-oauth')
  @ApiBody({ type: OAuthCodeDto })
  @HttpCode(HttpStatus.OK)
  @Public()
  async verifyOAuthTokenAndSignIn(@Body() oauthCode: OAuthCodeDto) {
    const result = await this.oAuthService.googleAuthenticate(oauthCode.code);

    return plainToInstance(AuthToken, result, {
      excludeExtraneousValues: true,
    });
  }
}
