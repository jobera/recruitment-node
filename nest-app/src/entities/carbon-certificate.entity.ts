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

  @Column({ nullable: true })
  ownerId: number | null;

  @ManyToOne((type) => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn()
  owner: UserEntity | null;
}
