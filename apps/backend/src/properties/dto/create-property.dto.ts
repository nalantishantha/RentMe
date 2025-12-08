export class CreatePropertyDto {
    title: string;
    description?: string;
    type: 'house' | 'annex' | 'room';
    address?: string;
    city?: string;
    price_per_month: number;
    currency?: string;
    bedrooms?: number;
    bathrooms?: number;
    area_sqm?: number;
    furnished?: boolean;
    available_from?: Date;
}
