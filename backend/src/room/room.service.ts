import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Room} from "./entities/room.entity";
import { FileUploadService } from '../file-upload-service';


@Injectable()
export class RoomService {
  constructor(
      @InjectRepository(Room)
      private readonly roomRepository: Repository<Room>,
      private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const { name, description, capacity, subject, style, picture, music, voiceover } = createRoomDto;
    const newRoom = this.roomRepository.create({
      name,
      description,
      capacity,
      subject,
      style,
      picture,
      music,
      voiceover
    });

    return this.roomRepository.save(newRoom);
  }

  async uploadRoomPicture(roomId: number, file: Express.Multer.File): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const filePath = await this.fileUploadService.uploadPicture(file);
    room.picture = filePath;

    return this.roomRepository.save(room);
  }

  async uploadRoomMusic(roomId: number, file: Express.Multer.File): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const filePath = await this.fileUploadService.uploadSound(file);
    room.music = filePath;

    return this.roomRepository.save(room);
  }

  async uploadRoomVoiceover(roomId: number, file: Express.Multer.File): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const filePath = await this.fileUploadService.uploadSound(file);
    room.voiceover = filePath;

    return this.roomRepository.save(room);
  }











  findAll() {
    return `This action returns all room`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
