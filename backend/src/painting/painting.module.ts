import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Painting } from './entities/painting.entity';
import { Room } from '../room/entities/room.entity';
import { PaintingService } from './painting.service';
import { PaintingController } from './painting.controller';
import { RoomModule } from "../room/room.module";

@Module({
  imports: [TypeOrmModule.forFeature([Painting, Room]), RoomModule],
  providers: [PaintingService],
  controllers: [PaintingController],
  exports: [PaintingService],
})
export class PaintingModule {}