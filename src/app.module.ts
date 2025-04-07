import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import dbConfig from "src/configs/db.config"


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
  }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
