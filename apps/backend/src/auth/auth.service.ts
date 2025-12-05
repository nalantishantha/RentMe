import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserPassword } from 'src/user-passwords/entities/user-password.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(UserPassword)
        private readonly userPasswordRepository: Repository<UserPassword>,

        private readonly jwtService: JwtService
    ){}

    async signup(signupData: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        password: string;
        }){

        // check user already exists..
        const exsistinguser = await this.userRepository.findOne({
            where: { email: signupData.email }
        })

        if(exsistinguser){
            throw new ConflictException("Email already registerd")
        }

        // Create User record
        const user = this.userRepository.create({
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            email: signupData.email,
            phone: signupData.phone || null,
            role: 'seller',
            isActive: true
        })

        const savedUser = await this.userRepository.save(user)

        // create password and hash it
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(signupData.password, salt)

        const UserPassword = this.userPasswordRepository.create({
            userId: savedUser.id,
            password: hashedPassword
        })

        await this.userPasswordRepository.save(UserPassword)

        const { password, ...userWithoutPassword } = savedUser;
        return {
            user: userWithoutPassword,
            message: 'User registered successfully'
        }
    }

    async validateUser(email: string, password: string): Promise<any> {
        // 1. Find user with password relation
        const user = await this.userRepository.findOne({
        where: { email, isActive: true },
        relations: ['password'],
        });

        if (!user) {
        throw new UnauthorizedException('Invalid email or password');
        }

        // 2. Check password
        const userPassword = await this.userPasswordRepository.findOne({ where: { userId: user.id } });
        if (!userPassword) {
            throw new UnauthorizedException('Invalid email or password');
        }
        
        const isPasswordValid = await bcrypt.compare(password, userPassword.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const { password: _, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        };

        return {
        access_token: this.jwtService.sign(payload),
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        };
    }

    async logout(userId: number) {
        return {
            message: 'Logout successful',
            userId,
        };
    }

}
