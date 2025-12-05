import { Injectable } from '@nestjs/common';
import { CreateUserPasswordDto } from './dto/create-user-password.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UserPasswordsService {
  create(createUserPasswordDto: CreateUserPasswordDto) {
    return 'This action adds a new userPassword';
  }

  findAll() {
    return `This action returns all userPasswords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPassword`;
  }

  update(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    return `This action updates a #${id} userPassword`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPassword`;
  }
}
