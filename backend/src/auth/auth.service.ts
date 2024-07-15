import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/entities/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    /**
     * Validate user credentials
     * @param username
     * @param pass
     */
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { username } });
        console.log('Found user:', user); // New log

        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            console.log('Validated user:', result); // New log
            return result;
        }
        console.log("Validate user not successful");
        return null;
    }

    /**
     * Login method. Creates and returns a JWT token.
     * @param user
     */
    async login(user: any) {
        console.log('User object in login:', user); // New log
        const payload = { username: user.username, rank: user.rank, sub: user.id };
        console.log('Payload for JWT:', payload); // New log
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}