import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsDateString, MaxLength } from 'class-validator';

export class CreatePropertyDto {
    @IsString()
    @MaxLength(250)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(['house', 'annex', 'room'])
    type: 'house' | 'annex' | 'room';

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    city?: string;

    @IsNumber()
    price_per_month: number;

    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsNumber()
    bedrooms?: number;

    @IsOptional()
    @IsNumber()
    bathrooms?: number;

    @IsOptional()
    @IsNumber()
    area_sqm?: number;

    @IsOptional()
    @IsBoolean()
    furnished?: boolean;

    @IsOptional()
    @IsDateString()
    available_from?: Date;
}
