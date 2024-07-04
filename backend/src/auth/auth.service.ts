import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    /**
     * Hier wordt gecontroleerd bij de ticketbooth of je zegt wie je bent dat je bent
     * @param username
     * @param pass
     */
    async validateUser(username: string, pass: string): Promise<any> {

        //Dit is als de vrouw achter de balie die je naam opzoekt in het registratiesboek
        const user = await this.userRepository.findOne({ where: { username } });
        console.log(username, pass)
        //Als hij de naam gevonden checkt hij hier of het wachtwoord klopt. Zou je kunnen zien als controleren of het gezicht
        //op de ID hetzelfde is als in het echt. Als alles klopt, geeft hij het result zonder gevoelige informatie zoals wachtwoord
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        console.log("validate user niet gelukt")
        return null;

    }

    /**
     * Login method. Hier wordt de armband afgegeven. De payload moet je zien als de details van het armbandje
     * waar informatie opstaat zoals de username en id.
     * @param user
     */
    async login(user: any) {
        const payload = { username: user.username, sub: user.id};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

