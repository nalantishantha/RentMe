import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Property } from '../properties/entities/properties.entity';
import { UserPassword } from '../user-passwords/entities/user-password.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(UserPassword)
    private userPasswordRepository: Repository<UserPassword>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Create user record
    const user = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phone: createUserDto.phone || null,
      role: createUserDto.role,
      isActive: true
    });

    const savedUser = await this.userRepository.save(user);

    // Create password and hash it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userPassword = this.userPasswordRepository.create({
      userId: savedUser.id,
      password: hashedPassword
    });

    await this.userPasswordRepository.save(userPassword);

    return this.findOne(savedUser.id);
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;
    
    const whereCondition = search
      ? [
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ]
      : {};

    const [users, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      take: limit,
      skip: skip,
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getUserWithProperties(id: number) {
    const user = await this.findOne(id);
    
    const properties = await this.propertyRepository.find({
      where: { seller_id: id },
      order: { created_at: 'DESC' },
    });

    return {
      ...user,
      properties,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    
    await this.userRepository.update(id, updateUserDto);
    
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    
    await this.userRepository.delete(id);
    
    return { message: 'User deleted successfully' };
  }

  async setInactive(id: number) {
    const user = await this.findOne(id);
    
    await this.userRepository.update(id, { isActive: false });
    
    return this.findOne(id);
  }

  async setActive(id: number) {
    const user = await this.findOne(id);
    
    await this.userRepository.update(id, { isActive: true });
    
    return this.findOne(id);
  }
}
