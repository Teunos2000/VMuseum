import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import {Room} from "../../room/entities/room.entity";

@Entity('Painting')
export class Painting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 45 })
    name: string;

    @Column('text')
    description: string;

    @Column({ length: 200, nullable: true })
    picture: string;

    @Column()
    views: number;

    @ManyToOne(() => Room, room => room.paintings)
    @JoinColumn({ name: 'Room_id' })
    room: Room;
}