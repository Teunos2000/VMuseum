import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    profilepicture: string;

    @Column()
    rank: number;
}