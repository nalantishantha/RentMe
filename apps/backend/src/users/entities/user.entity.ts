import { UserPassword } from 'src/user-passwords/entities/user-password.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, Index } from 'typeorm';

@Entity('users')
@Index(['email', 'isActive']) // Composite index for faster login queries
@Index(['role']) // Index for role-based queries
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column()
  role: string; // 'admin'|'seller'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToOne(() => UserPassword, (password) => password.user)
  password: UserPassword;
}