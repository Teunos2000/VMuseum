export class Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  subject: string;
  style: string;
  picture?: string;
  music?: string;
  voiceover?: string;

  constructor(
    id: number,
    name: string,
    description: string,
    capacity: number,
    subject: string,
    style: string,
    picture?: string,
    music?: string,
    voiceover?: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.capacity = capacity;
    this.subject = subject;
    this.style = style;
    this.picture = picture;
    this.music = music;
    this.voiceover = voiceover;
  }
}
