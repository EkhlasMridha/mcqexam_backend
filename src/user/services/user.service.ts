import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheService } from 'src/common/services/cache.service';
import { User } from 'src/user/schemas/user';
import { UserDto } from '../dtos/userDto';
import { UserPermission } from 'src/constants/permissions.constant';

interface CreateUserParams {
  userData: UserDto;
  hashedPassword?: string;
  permission?: UserPermission;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private cacheService: CacheService,
  ) {}

  async getUserById(id: string) {
    const result = await this.cacheService.getQueryWithCacheStore<User>({
      cacheKey: {
        getKey: 'id',
        setKey: ['id', 'email'],
      },
      query: async () => await this.userModel.findById<User>(id),
    });
    return result;
  }

  async getUserByEmail(email: string) {
    const result = await this.cacheService.getQueryWithCacheStore<User>({
      cacheKey: {
        getKey: 'email',
        setKey: ['id', 'email'],
      },
      query: async () => await this.userModel.findOne<User>({ email: email }),
    });

    return result;
  }

  async createUser({
    permission = UserPermission.USER,
    userData,
    hashedPassword,
  }: CreateUserParams) {
    const pass = hashedPassword || userData?.password;
    const newUser = new this.userModel({
      ...userData,
      password: pass,
      permissionLevel: permission,
    });

    const result = await this.cacheService.writeDataWithStore({
      cacheKey: ['email', 'id'],
      query: () => newUser.save(),
    });

    return result;
  }
}
