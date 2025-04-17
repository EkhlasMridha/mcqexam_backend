import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SigninDto } from './dtos/signin-dto';
import { UserDto } from 'src/user/dtos/userDto';
import { AuthService } from './services/auth.service';
import { plainToInstance } from 'class-transformer';
import { ApiBody } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SigninDto })
  @Public()
  async signInUser(@Body() singinDto: SigninDto) {
    return await this.authService.signInUser(singinDto);
  }

  @Post('admin/signup')
  @ApiBody({ type: UserDto })
  @Public()
  async signUpAdmin(@Body() userDto: UserDto) {
    const result = await this.authService.signUpAdmin(userDto);

    return plainToInstance(UserDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
