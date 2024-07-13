import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException, NotFoundException, UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {FileInterceptor} from "@nestjs/platform-express";
import {AuthGuard} from "@nestjs/passport";

@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  @Get('check-username/:username')
  async checkUsername(@Param('username') username: string) {
    const isTaken = await this.userService.isUsernameTaken(username);
    return { available: !isTaken };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  //Guarded route with JWT
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
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
        limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
      }),
  )
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File, @Body('userId') userId?: string) {
    if (!file) {
      throw new BadRequestException('File is not provided or invalid.');
    }
    const filePath = `/uploads/${file.filename}`;

    // If userId is provided, update the existing user's profile picture
    if (userId) {
      await this.userService.updateProfilePicture(parseInt(userId), filePath);
    }

    return { filePath };
  }
}