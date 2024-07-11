import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'), // Adjust the path as necessary
            serveRoot: '/uploads', // Route to serve static files
        }),
    ],
})
export class StaticFilesModule {}
