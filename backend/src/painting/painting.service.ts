import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Painting } from './entities/painting.entity';
import { CreatePaintingDto } from './dto/create-painting.dto';
import { Room } from '../room/entities/room.entity';

@Injectable()
export class PaintingService {
  constructor(
      @InjectRepository(Painting)
      private readonly paintingRepository: Repository<Painting>,
      @InjectRepository(Room)
      private readonly roomRepository: Repository<Room>,
  ) {}

  async create(createPaintingDto: CreatePaintingDto): Promise<Painting> {
    const room = await this.roomRepository.findOneBy({ id: createPaintingDto.Room_id });
    if (!room) {
      throw new NotFoundException(`Room with ID ${createPaintingDto.Room_id} not found`);
    }

    const newPainting = this.paintingRepository.create({
      name: createPaintingDto.name,
      description: createPaintingDto.description,
      picture: createPaintingDto.picture,
      views: createPaintingDto.views,
      room: room,
    });

    return this.paintingRepository.save(newPainting);
  }

  async findAll(): Promise<Painting[]> {
    return this.paintingRepository.find({ relations: ['room'] });
  }

  async findOne(id: number): Promise<Painting> {
    const painting = await this.paintingRepository.findOne({
      where: { id },
      relations: ['room']
    });
    if (!painting) {
      throw new NotFoundException(`Painting with ID ${id} not found`);
    }
    return painting;
  }

  async findByRoom(roomId: number): Promise<Painting[]> {
    if (typeof roomId !== 'number' || isNaN(roomId)) {
      throw new BadRequestException('Invalid room ID');
    }
    return this.paintingRepository.find({
      where: { room: { id: roomId } },
      relations: ['room']
    });
  }

  async update(id: number, updatePaintingDto: Partial<CreatePaintingDto>): Promise<Painting> {
    const painting = await this.findOne(id);
    Object.assign(painting, updatePaintingDto);
    return this.paintingRepository.save(painting);
  }

  async remove(id: number): Promise<void> {
    const painting = await this.findOne(id);
    await this.paintingRepository.remove(painting);
  }

  async uploadPaintingPicture(paintingId: number, file: Express.Multer.File): Promise<Painting> {
    const painting = await this.findOne(paintingId);
    const filePath = `/uploads/paintingpictures/${file.filename}`;
    painting.picture = filePath;
    return this.paintingRepository.save(painting);
  }
}