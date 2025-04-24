import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import jwtConfig from 'src/configs/jwt.config';
import { User, UserSchema } from 'src/user/schemas/user';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { BcryptProvider } from './services/bcrypt.provider';
import { HashingProvider } from './services/hashing.provider';
import { JwtStrategyService } from './services/jwt-strategy.service';
import { OAuthService } from './services/o-auth.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: UserSchema, name: User.name }]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UserModule,
  ],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
    JwtStrategyService,
    TokenService,
    OAuthService,
  ],
  controllers: [AuthController],
  exports: [JwtModule, JwtStrategyService],
})
export class AuthModule {}
