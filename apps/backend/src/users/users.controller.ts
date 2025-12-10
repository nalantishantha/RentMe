import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.usersService.findAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  @Roles('admin')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get(':id/details')
  @Roles('admin')
  async getUserWithProperties(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserWithProperties(id);
  }

  @Patch(':id')
  @Roles('admin')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id/inactive')
  @Roles('admin')
  async setInactive(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.setInactive(id);
  }

  @Patch(':id/active')
  @Roles('admin')
  async setActive(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.setActive(id);
  }
}
