import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Room } from './room/entities/room.entity';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { StaticFilesModule } from './static-files.module';
import { RoomModule } from './room/room.module';
import { FileUploadService } from './file-upload-service';
import { PaintingModule } from './painting/painting.module';
import {Painting} from "./painting/entities/painting.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Room, Painting],
      synchronize: true, // Change to false in production
    }),
    UserModule,
    AuthModule,
    StaticFilesModule,
    ScheduleModule.forRoot(),
    RoomModule,
    PaintingModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, FileUploadService],
})
export class AppModule {}
