import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import dbConfig from 'src/configs/db.config';
import jwtConfig from 'src/configs/jwt.config';
import { AuthModule } from './auth/auth.module';
import { JwtStrategyService } from './auth/services/jwt-strategy.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SharedModule } from './common/shared.module';
import { RequestContextMiddleware } from './request-context.middleware';
import { UserModule } from './user/user.module';
import { AuthorizationGuard } from './common/guards/authorization.guard';

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
    CacheModule.register({
      isGlobal: true,
      cacheId: 'mcq_app',
    }),
    UserModule,
    AuthModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategyService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
