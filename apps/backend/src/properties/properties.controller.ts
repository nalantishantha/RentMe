import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { RequirePermissions } from 'src/decorators/permissions.decorator';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('add_property')
  async create(@Req() req, @Body() createPropertyDto: CreatePropertyDto){
    return await this.propertiesService.createProperty(req.user.userId, createPropertyDto)
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('edit_own_property')
  async getMyProperties(@Req() req){
    return await this.propertiesService.findBySeller(req.user.userId)
  }

  @Get()
  async getAllProperties(@Req() req) {
    const { search } = req.query;
    if (search) {
      return await this.propertiesService.searchProperties(search);
    }
    return await this.propertiesService.findAll();
  }

}
