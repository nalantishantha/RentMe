import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserPassword } from 'src/user-passwords/entities/user-password.entity';
import { JwtService } from '@nestjs/jwt';
import { Permission } from 'src/permissions/entities/permission.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(UserPassword)
        private readonly userPasswordRepository: Repository<UserPassword>,

        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,

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

        // create password and hash it (reduced to 8 rounds for better performance)
        const salt = await bcrypt.genSalt(8)
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
        // Find user and password in single query
        const userPassword = await this.userPasswordRepository
            .createQueryBuilder('up')
            .innerJoin('up.user', 'user')
            .where('user.email = :email', { email })
            .andWhere('user.isActive = :isActive', { isActive: true })
            .select(['up.userId', 'up.password'])
            .getOne();

        if (!userPassword) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, userPassword.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Fetch user details only after password validation
        const user = await this.userRepository.findOne({
            where: { id: userPassword.userId },
            select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive']
        });

        return user;
    }

    async login(user: any) {
        // Fetch permissions for user's role
        const rolePermissions = await this.permissionRepository.findOne({
            where: { role: user.role }
        });

        const permissions = rolePermissions ? rolePermissions.permissions : {};

        const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: permissions,
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
        permissions: permissions,
        };
    }

    async logout(userId: number) {
        return {
            message: 'Logout successful',
            userId,
        };
    }

}
