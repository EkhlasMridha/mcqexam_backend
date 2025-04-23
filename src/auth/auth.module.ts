import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user';
import { AuthService } from './services/auth.service';
import { HashingProvider } from './services/hashing.provider';
import { BcryptProvider } from './services/bcrypt.provider';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/configs/jwt.config';
import { JwtStrategyService } from './services/jwt-strategy.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: UserSchema, name: User.name }]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
    JwtStrategyService,
    TokenService,
  ],
  controllers: [AuthController],
  exports: [JwtModule, JwtStrategyService],
})
export class AuthModule {}
