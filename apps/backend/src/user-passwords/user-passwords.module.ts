import { Module } from '@nestjs/common';
import { UserPasswordsService } from './user-passwords.service';
import { UserPasswordsController } from './user-passwords.controller';

@Module({
  controllers: [UserPasswordsController],
  providers: [UserPasswordsService],
})
export class UserPasswordsModule {}
