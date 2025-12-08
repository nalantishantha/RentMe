import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/properties.entity';
import { PropertyImage } from './entities/property-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, PropertyImage])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
