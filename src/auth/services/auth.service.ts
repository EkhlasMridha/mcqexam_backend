import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user';
import { SigninDto } from '../dtos/signin-dto';
import { HashingProvider } from 'src/auth/services/hashing.provider';
import { UserDto } from 'src/user/dtos/userDto';
import { UserPermission } from 'src/constants/permissions.constant';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingProvider: HashingProvider,
    private jwtService: JwtService,
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
    const payload = {
      usr: user.id,
      email: user.email,
      aut: user.permissionLevel,
    };
    const accessToken = await this.jwtService.signAsync(payload);

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
