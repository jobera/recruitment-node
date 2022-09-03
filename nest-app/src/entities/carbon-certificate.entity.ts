import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class CarbonCertificateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column()
  status: 'available' | 'owned' | 'transferred';

  @Column()
  ownerId: number;

  @ManyToOne((type) => UserEntity, (user) => user.id)
  @JoinColumn()
  owner: UserEntity | null;
}
