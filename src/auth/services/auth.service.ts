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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingProvider: HashingProvider,
    private tokenService: TokenService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findByEmail(email: string) {
    const userData = await this.userModel.findOne<User>({ email: email });
    return userData;
  }

  async signInUser(signInDto: SigninDto) {
    const user = await this.findByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    if (!!user) {
      await this.cacheManager.set(user.email, user);
      await this.cacheManager.set(user.id, user);
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

    const user = new this.userModel({
      ...userDto,
      password: hashedPassword,
      permissionLevel: UserPermission.ADMIN,
    });

    return await user.save();
  }
}
