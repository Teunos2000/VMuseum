import {Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Post(':id/upload-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPicture(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.roomService.uploadRoomPicture(id, file);
  }

  @Post(':id/upload-music')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMusic(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.roomService.uploadRoomMusic(id, file);
  }

  @Post(':id/upload-voiceover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVoiceover(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.roomService.uploadRoomVoiceover(id, file);
  }













  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }


}
