import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { SigninDto } from './dtos/signin-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signInUser(@Body() singinDto: SigninDto) {}
}
