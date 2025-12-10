import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Property } from '../properties/entities/properties.entity';
import { UserPassword } from '../user-passwords/entities/user-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property, UserPassword])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
