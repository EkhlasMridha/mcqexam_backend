import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashingProvider } from 'src/auth/services/hashing.provider';
import { AccessTokenPayload } from 'src/common/types';
import { UserPermission } from 'src/constants/permissions.constant';
import { UserDto } from 'src/user/dtos/userDto';
import { User } from 'src/user/schemas/user';
import { SigninDto } from '../dtos/signin-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingProvider: HashingProvider,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findByEmail(email: string) {
    return await this.userModel.findOne<User>({ email: email });
  }

  async signInUser(signInDto: SigninDto) {
    const user = await this.findByEmail(signInDto.email);
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
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('jwt.accessTokenTtl'),
      audience: this.configService.get('jwt.audience'),
      issuer: this.configService.get('jwt.issuer'),
    });

    return { access_token: accessToken };
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
