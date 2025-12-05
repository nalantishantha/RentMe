import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserPasswordsService } from './user-passwords.service';
import { CreateUserPasswordDto } from './dto/create-user-password.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('user-passwords')
export class UserPasswordsController {
  constructor(private readonly userPasswordsService: UserPasswordsService) {}

  @Post()
  create(@Body() createUserPasswordDto: CreateUserPasswordDto) {
    return this.userPasswordsService.create(createUserPasswordDto);
  }

  @Get()
  findAll() {
    return this.userPasswordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPasswordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    return this.userPasswordsService.update(+id, updateUserPasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPasswordsService.remove(+id);
  }
}
