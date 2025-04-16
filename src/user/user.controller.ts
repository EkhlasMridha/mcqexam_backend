import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserDto';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {

    constructor(private userService:UserService){}

    @Post()
    async createAdminUser(@Body() createAdminDto:CreateUserDto){
       const result = await this.userService.createAdmin(createAdminDto);
    }
}
