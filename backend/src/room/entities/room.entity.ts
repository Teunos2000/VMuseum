import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Painting} from "../../painting/entities/painting.entity";

@Entity('Room')
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 45 })
    name: string;

    @Column('text')
    description: string;

    @Column()
    capacity: number;

    @Column({ length: 45 })
    subject: string;

    @Column({ length: 45 })
    style: string;

    @Column({ length: 200, nullable: true })
    picture: string;

    @Column({ length: 200, nullable: true })
    music: string;

    @Column({ length: 200, nullable: true })
    voiceover: string;

    @OneToMany(() => Painting, painting => painting.room)
    paintings: Painting[];
}
