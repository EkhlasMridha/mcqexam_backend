import { BadRequestException, Injectable } from '@nestjs/common';
import { HashingProvider } from 'src/auth/services/hashing.provider';
import { CacheService } from 'src/common/services/cache.service';
import { AccessTokenPayload } from 'src/common/types';
import { UserPermission } from 'src/constants/permissions.constant';
import { UserDto } from 'src/user/dtos/userDto';
import { UserService } from 'src/user/services/user.service';
import { uuidv7 } from 'uuidv7';
import { AuthToken } from '../dtos/auth-token';
import { SigninDto } from '../dtos/signin-dto';
import { TokenService } from './token.service';
import { Schema } from 'mongoose';
import { OrganizationService } from 'src/organization/services/organization.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private tokenService: TokenService,
    private cashService: CacheService,
    private organizationService: OrganizationService,
  ) {}

  async signInUser(signInDto: SigninDto) {
    const user = await this.userService.getUserByEmail(signInDto.email);
    if (!user || !user.password) {
      throw new BadRequestException('Invalid email or password');
    }

    const isOk = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!isOk) {
      throw new BadRequestException('Invalid email or password');
    }

    const tokenId = uuidv7();
    const payload: AccessTokenPayload = {
      usr: user.id,
      email: user.email,
      aut: user.permissionLevel,
      iv: tokenId,
      oid: user.organization_id?.toString() || null,
    };

    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);

    return new AuthToken(accessToken, refreshToken);
  }

  async signUpAdmin(userDto: UserDto) {
    const hashedPassword = await this.hashingProvider.hashPassword(
      userDto.password,
    );

    const org = await this.organizationService.createOrganization({
      organization_name: `${userDto.firstName} ${userDto.lastName}`,
    });
    return await this.userService.createUser({
      userData: userDto,
      hashedPassword: hashedPassword,
      permission: UserPermission.ADMIN,
      orgId: org.id,
    });
  }

  async userSignup(userDto: UserDto) {
    const hashedPassword = await this.hashingProvider.hashPassword(
      userDto.password,
    );

    const org = await this.organizationService.createOrganization({
      organization_name: `${userDto.firstName} ${userDto.lastName}`,
    });
    return await this.userService.createUser({
      userData: userDto,
      hashedPassword: hashedPassword,
      permission: UserPermission.USER,
      orgId: org.id,
    });
  }

  async rotateAccessTokenByRefreshToken(refreshToken: string) {
    if (!refreshToken) return null;

    const tokenPayload =
      await this.cashService.getData<AccessTokenPayload>(refreshToken);
    if (!tokenPayload) return null;

    await this.cashService.deleteData(refreshToken);
    const tokenId = await this.cashService.getData<string>(tokenPayload.iv);
    if (!tokenId) return null;

    const userData = await this.userService.getUserById(tokenPayload.usr);
    if (!userData) return null;

    const payload: AccessTokenPayload = {
      usr: userData.id,
      email: userData.email,
      aut: userData.permissionLevel,
      iv: tokenId,
    };
    const accessToken = await this.tokenService.generateAccessToken(payload);
    const newRefreshToken =
      await this.tokenService.generateRefreshToken(payload);

    const token = new AuthToken(accessToken, newRefreshToken);
    return token;
  }

  async signOutUser(token: AccessTokenPayload, refreshToken: string) {
    await this.cashService.deleteData(token.iv);
    await this.cashService.deleteData(refreshToken);
  }
}
