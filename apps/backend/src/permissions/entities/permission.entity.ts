import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  role: string; // 'admin', 'seller', 'renter'

  @Column({ type: 'json', default: {} })
  permissions: {
    browse_properties?: boolean;
    add_property?: boolean;
    edit_own_property?: boolean;
    delete_own_property?: boolean;
    view_all_users?: boolean;
    add_user?: boolean;
    edit_user?: boolean;
    delete_user?: boolean;
    manage_permissions?: boolean;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
