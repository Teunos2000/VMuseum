import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { FileUploadService } from '../file-upload-service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([Room]),
  AuthModule
  ],
  providers: [RoomService, FileUploadService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
