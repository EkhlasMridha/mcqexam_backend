import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { RequestContextService } from 'src/request-context.service';
import { UserDto } from './dtos/userDto';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private contextService: RequestContextService,
  ) {}

  @Get('profile')
  @ApiBearerAuth('access-token')
  async getUserProfile() {
    const userPayload = this.contextService.get('user');
    if (!userPayload) throw new BadRequestException('No user id found');
    const user = await this.userService.getProfileById(userPayload?.usr);
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }
}
