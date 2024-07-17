import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards, UploadedFile, BadRequestException
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import { AdminGuard } from "../user/auth.guard";
import { JwtAuthGuard } from "../auth/jwt-auth-guard";
import {extname} from "path";
import {diskStorage} from "multer";

@Controller('room')
@UseGuards(JwtAuthGuard, AdminGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }


  @Post(':id/upload-picture')
  @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/roompictures',
          filename: (req, file, cb) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            cb(new BadRequestException('Only JPG, JPEG, and PNG files are allowed!'), false);
          } else {
            cb(null, true);
          }
        },
      }),
  )
  async uploadPicture(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.roomService.uploadRoomPicture(id, file);
  }

  @Post(':id/upload-music')
  @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/roommusic',
          filename: (req, file, cb) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
  )
  async uploadMusic(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.roomService.uploadRoomMusic(id, file);
  }

  @Post(':id/upload-voiceover')
  @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/roomvoiceovers',
          filename: (req, file, cb) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
  )
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
