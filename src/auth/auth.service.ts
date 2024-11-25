import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ){}

    async signUp(user: Partial<User>){
        const { email, password } = user;
        if(!email || !password) throw new BadRequestException('Required');

        const foundUser = await this.userRepository.getUserByEmail(user.email);
        if(foundUser) throw new BadRequestException('Email already registered');


    const hashedPassword = await bcrypt.hash(user.password, 10);
    if(!hashedPassword)
        throw new BadRequestException('Password could nor hashed');

    console.log(hashedPassword);

    await this.userRepository.createUser({
        ...user,
        password: hashedPassword,
    });

    return 'User created successfully';
 }

 async login(email: string, password: string){
    if(!email || !password) throw new BadRequestException('Required');

    const user = await this.userRepository.getUserByEmail(email);

    if(!user) throw new NotFoundException('Invalid Credentials');

    const passwordValidation = await bcrypt.compare(password, user.password);
    if(!passwordValidation) throw new BadRequestException('Invalid Credentials');

    const payload = {
        id: user.id,
        email: user.email
    };

    const token = this.jwtService.sign(payload);

    return {
        message: 'Loggin Succefully',
        token,
        user,
    };
 }


}
