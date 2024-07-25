import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { PaintingService } from './painting.service';
import { CreatePaintingDto } from './dto/create-painting.dto';
import { UpdatePaintingDto } from './dto/update-painting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { AdminGuard } from '../user/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

//yes
@Controller('painting')
export class PaintingController {
  constructor(private readonly paintingService: PaintingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createPaintingDto: CreatePaintingDto) {
    return this.paintingService.create(createPaintingDto);
  }

  @Get()
  findAll() {
    return this.paintingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paintingService.findOne(+id);
  }

  @Get('room/:roomId')
  findByRoom(@Param('roomId') roomId: string) {
    const parsedRoomId = parseInt(roomId, 10);
    if (isNaN(parsedRoomId)) {
      throw new BadRequestException('Invalid room ID');
    }
    return this.paintingService.findByRoom(parsedRoomId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updatePaintingDto: UpdatePaintingDto) {
    return this.paintingService.update(+id, updatePaintingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.paintingService.remove(+id);
  }

  @Post(':id/upload-picture')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/paintingpictures',
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
  async uploadPicture(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.paintingService.uploadPaintingPicture(id, file);
  }
}