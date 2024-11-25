import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    getAllUser(): Promise<User[]> {
        return this.userRepository.find();
    }

    getUserById(userId: string): Promise <User>{
        return this.userRepository.findOne({where: {id: userId}})
    }

    getUserByEmail(email: string): Promise<User | null>{
        return this.userRepository.findOne({where: {email: email}})
    }

    createUser(userData: Partial<User>): Promise<User>{
        const newUser = this.userRepository.create(userData);
        return this.userRepository.save(newUser);
    }

    userUpdate(id: string, updateUser: Partial<User>){
        return this.userRepository.update(id, updateUser);
    }
} 