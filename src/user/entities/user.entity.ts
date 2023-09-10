import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { hashSync } from 'bcryptjs';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: '' })
  real_name: string;

  @Column({ default: '男' })
  gender: string;

  @Column({ default: '' })
  age: string;

  @Column({ default: '' })
  identity: string;

  @Column({ default: '' })
  work: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  province: string;

  @Column({ default: '' })
  city: string;

  @Column({ default: '' })
  area: string;

  @BeforeInsert()
  @BeforeUpdate()
  encryptPwd() {
    this.password = hashSync(this.password, 10);
  }

  @DeleteDateColumn()
  deleted_at: Date;
}
