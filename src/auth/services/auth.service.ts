import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { HashingProvider } from 'src/auth/services/hashing.provider';
import { AccessTokenPayload } from 'src/common/types';
import { UserPermission } from 'src/constants/permissions.constant';
import { UserDto } from 'src/user/dtos/userDto';
import { User } from 'src/user/schemas/user';
import { SigninDto } from '../dtos/signin-dto';
import { TokenService } from './token.service';
import { UserService } from 'src/user/services/user.service';
import { CacheService } from 'src/common/services/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private tokenService: TokenService,
    private cashService: CacheService,
  ) {}

  async signInUser(signInDto: SigninDto) {
    const user = await this.userService.getUserByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isOk = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!isOk) {
      throw new BadRequestException('Invalid email or password');
    }
    const payload: AccessTokenPayload = {
      usr: user.id,
      email: user.email,
      aut: user.permissionLevel,
    };
    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async signUpAdmin(userDto: UserDto) {
    const hashedPassword = await this.hashingProvider.hashPassword(
      userDto.password,
    );

    return await this.userService.createUser({
      userData: userDto,
      hashedPassword: hashedPassword,
      permission: UserPermission.ADMIN,
    });
  }

  async rotateAccessTokenByRefreshToken(refreshToken: string) {
    if (!refreshToken) return null;

    const tokenPayload =
      await this.cashService.getData<AccessTokenPayload>(refreshToken);
    if (!tokenPayload) return null;

    const userData = await this.userService.getUserById(tokenPayload.usr);
    if (!userData) return null;

    const payload: AccessTokenPayload = {
      usr: userData.id,
      email: userData.email,
      aut: userData.permissionLevel,
    };
    const accessToken = await this.tokenService.generateAccessToken(payload);
    const newRefreshToken =
      await this.tokenService.generateRefreshToken(payload);

    return { access_token: accessToken, refresh_token: newRefreshToken };
  }
}
