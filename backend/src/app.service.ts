import {Injectable, Logger} from '@nestjs/common';
import {Cron} from "@nestjs/schedule";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user/entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}


  //Cron method om events te schedulen. Dit wordt nu elke 4 minuten gepingt
  @Cron('*/4 * * * *') // Runs every 5 minutes
  async handleCron() {
    this.logger.debug('Running a ping to the database...');
    try {
      await this.userRepository.findOne({
        where: { id : 1}
      });
      this.logger.debug('Database pinged successfully!');
    } catch (error) {
      this.logger.error('Error pinging the database:', error);
    }
  }
}
