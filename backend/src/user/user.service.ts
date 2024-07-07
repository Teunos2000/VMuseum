import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { User} from "./entities/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, email, profilepicture, rank } = createUserDto;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      profilepicture,
      rank,
    });

    return this.userRepository.save(newUser);
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({where: { username }});
    //Makes undefined/null a boolean variable.
    return !!user
  }

  findAll() {
    console.log(this.userRepository);
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({id});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
