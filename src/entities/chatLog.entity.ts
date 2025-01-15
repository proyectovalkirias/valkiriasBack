
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ChatLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @OneToOne(() => User) 
    @JoinColumn({ name: 'userId' })
    user: User; 
  
    @Column('jsonb', { default: [] }) 
    messages: { sender: string; content: string }[];
  
    @Column()
    timestamp: Date; 
  
    @Column()
    isActive: boolean; 
  }