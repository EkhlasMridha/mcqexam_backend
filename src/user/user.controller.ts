import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from './dtos/userDto';
import { UserService } from './services/user.service';
import { ApiBody } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiBody({ type: UserDto })
  async createAdminUser(@Body() createAdminDto: UserDto) {
    const result = await this.userService.createAdmin(createAdminDto);
    return plainToInstance(UserDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
