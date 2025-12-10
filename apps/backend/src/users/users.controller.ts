import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('add_user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequirePermissions('view_all_users')
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.usersService.findAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  @RequirePermissions('view_all_users')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get(':id/details')
  @RequirePermissions('view_all_users')
  async getUserWithProperties(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserWithProperties(id);
  }

  @Patch(':id')
  @RequirePermissions('edit_user')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions('delete_user')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id/inactive')
  @RequirePermissions('edit_user')
  async setInactive(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.setInactive(id);
  }

  @Patch(':id/active')
  @RequirePermissions('edit_user')
  async setActive(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.setActive(id);
  }
}
