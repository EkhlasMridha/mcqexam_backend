import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/createUserDto';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user';
import { InjectModel } from '@nestjs/mongoose';
import { UserPermission } from 'src/constants/permissions.constant';
import { HashingProvider } from 'src/utility/services/hashing.provider';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private hashingProvider: HashingProvider,
  ) {}

  async createAdmin(userDto: CreateUserDto) {
    const hashedPassword = await this.hashingProvider.hashPassword(
      userDto.password,
    );

    const user = new this.userModel({
      ...userDto,
      password: hashedPassword,
      permissionLevel: UserPermission.ADMIN,
    });

    const result = await user.save();

    return plainToInstance(CreateUserDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
