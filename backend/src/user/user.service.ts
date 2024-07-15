import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new user with hashed password.
   * @param createUserDto - Data Transfer Object containing user data
   * @returns The created user entity
   */
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

  /**
   * Check if a username is already taken.
   * @param username - The username to check
   * @returns A boolean indicating if the username is taken
   */
  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return !!user;
  }

  /**
   * Find all users.
   * @returns A promise with an array of all user entities
   */
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Find a user by ID.
   * @param id - The ID of the user to find
   * @returns A promise with the user entity or undefined
   */
  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * Update a user by ID.
   * @param id - The ID of the user to update
   * @param updateUserDto - Data Transfer Object containing the updated data
   * @returns A promise with the update result
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  /**
   * Remove a user by ID.
   * @param id - The ID of the user to remove
   * @returns A promise with the delete result
   */
  async remove(id: number): Promise<void> {
    const deleteResult = await this.userRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Update a user's profile picture.
   * @param userId - The ID of the user
   * @param profilePicture - The new profile picture URL
   * @returns A promise with the updated user entity
   */
  async updateProfilePicture(userId: number, profilePicture: string): Promise<User> {
    const updateResult = await this.userRepository.update({ id: userId }, { profilepicture: profilePicture });
    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const updatedUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found after update`);
    }
    return updatedUser;
  }
}
