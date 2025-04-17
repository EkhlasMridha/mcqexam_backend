import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dtos/userDto';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user';
import { InjectModel } from '@nestjs/mongoose';
import { UserPermission } from 'src/common/constants/permissions.constant';
import { HashingProvider } from 'src/auth/services/hashing.provider';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
}
