import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import dbConfig from 'src/configs/db.config';
import jwtConfig from 'src/configs/jwt.config';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { UserModule } from './user/user.module';
import { UtilityModule } from './utility/utility.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [dbConfig, jwtConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          dbName: configService.get('database.dbName'),
          uri: configService.get('database.connectionString'),
          minPoolSize: 2,
          maxPoolSize: 50,
        };
      },
    }),
    UserModule,
    AuthModule,
    UtilityModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
