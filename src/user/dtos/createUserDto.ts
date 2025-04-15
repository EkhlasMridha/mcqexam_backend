import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator"

export class CreateUserDto {
    @IsString()
    @MaxLength(250)
    @MinLength(2)
    @IsNotEmpty()
    firstName:string;

    @IsString()
    @MaxLength(250)
    @MinLength(2)
    @IsNotEmpty()
    lastName:string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,{message:"Weak password"})
    password:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
}
