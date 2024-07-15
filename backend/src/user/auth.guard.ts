import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from './user.service';

/**
 * Class to check for the admin rank
 */
@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if(user && user.id) {
            const userDetails = await this.userService.findOne(user.id);
            return userDetails && userDetails.rank === 2;
        }

        return false;
    }
}