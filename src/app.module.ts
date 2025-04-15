import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import dbConfig from "src/configs/db.config";
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UtilityModule } from './utility/utility.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:['.env.local','.env'],
    load:[dbConfig]
  }),MongooseModule.forRootAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>{
      return {
        dbName:configService.get("database.dbName"),
        uri:configService.get('database.connectionString'),
        minPoolSize:2,
        maxPoolSize:50
      }
    }
  }), UserModule, AuthModule, UtilityModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
