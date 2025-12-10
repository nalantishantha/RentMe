import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { UserPasswordsModule } from './user-passwords/user-passwords.module';
import { UserPassword } from './user-passwords/entities/user-password.entity';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { Property } from './properties/entities/properties.entity';
import { PropertyImage } from './properties/entities/property-image.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { Permission } from './permissions/entities/permission.entity';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, UserPassword, Property, PropertyImage, Permission],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, UserPassword, Property, PropertyImage, Permission]),
    AuthModule,
    UsersModule,
    UserPasswordsModule,
    PropertiesModule,
    PermissionsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
