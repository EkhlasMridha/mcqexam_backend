import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserDto';
import { UserService } from './services/user.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  async createAdminUser(@Body() createAdminDto: CreateUserDto) {
    const result = await this.userService.createAdmin(createAdminDto);
    return result;
  }
}
