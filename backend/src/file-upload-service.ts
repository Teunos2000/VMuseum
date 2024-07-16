import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FileUploadService {
    private readonly baseUploadUrl = 'http://yourdomain.com/uploads'; // Adjust as necessary

    async uploadPicture(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }

        const uploadPath = join(__dirname, '..', 'uploads', 'pictures', file.originalname);
        await fs.writeFile(uploadPath, file.buffer);

        return `${this.baseUploadUrl}/pictures/${file.originalname}`;
    }

    async uploadSound(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }

        const uploadPath = join(__dirname, '..', 'uploads', 'sounds', file.originalname);
        await fs.writeFile(uploadPath, file.buffer);

        return `${this.baseUploadUrl}/sounds/${file.originalname}`;
    }
}
