import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PropertyImage } from './property-image.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seller_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ length: 250 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 20, default: 'house' })
  type: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 150, nullable: true })
  city: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price_per_month: number;

  @Column({ length: 10, default: 'LKR' })
  currency: string;

  @Column({ type: 'smallint', nullable: true })
  bedrooms: number;

  @Column({ type: 'smallint', nullable: true })
  bathrooms: number;

  @Column({ type: 'numeric', precision: 8, scale: 2, nullable: true })
  area_sqm: number;

  @Column({ type: 'boolean', default: false })
  furnished: boolean;

  @Column({ type: 'date', nullable: true })
  available_from: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date;

  @OneToMany(() => PropertyImage, image => image.property)
  images: PropertyImage[];
}
