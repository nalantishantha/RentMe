import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  async create(@Req() req, @Body() createPropertyDto: CreatePropertyDto){
    return await this.propertiesService.createProperty(req.user.userId, createPropertyDto)
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  async getMyProperties(@Req() req){
    return await this.propertiesService.findBySeller(req.user.userId)
  }

  @Get()
  async getAllProperties(){
    return await this.propertiesService.findAll()
  }

}
