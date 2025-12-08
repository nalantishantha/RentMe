import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Property } from './properties.entity';

@Entity('property_images')
export class PropertyImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  property_id: number;

  @ManyToOne(() => Property, property => property.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'integer', default: 0 })
  display_order: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
