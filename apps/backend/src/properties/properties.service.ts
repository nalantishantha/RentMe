  
import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/properties.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>
  ){}

  async createProperty(sellerId: number, createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      seller_id: sellerId,
    });
    return await this.propertyRepository.save(property);
  }

  async findBySeller(sellerId: number): Promise<Property[]>{
    return await this.propertyRepository.find({ where: {seller_id: sellerId} })
  }

  async findAll(): Promise<Property[]> {
    return await this.propertyRepository.find({
      relations: ['seller'],
      order: {
        created_at: 'DESC'
      }
    })
  }

  async searchProperties(search: string): Promise<Property[]> {
    return await this.propertyRepository.createQueryBuilder('property')
      .leftJoinAndSelect('property.seller', 'seller')
      .where('property.type ILIKE :search', { search: `%${search}%` })
      .orWhere('property.city ILIKE :search', { search: `%${search}%` })
      .orWhere('seller.firstName ILIKE :search', { search: `%${search}%` })
      .orWhere('seller.lastName ILIKE :search', { search: `%${search}%` })
      .orderBy('property.created_at', 'DESC')
      .getMany();
  }
}

