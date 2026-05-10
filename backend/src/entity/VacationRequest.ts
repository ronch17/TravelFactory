import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { RequestStatus } from "../config/constants";
import { User } from "./User";

@Entity({ name: "vacation_requests" })
export class VacationRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "user_id" })
  userId!: number;

  @ManyToOne(() => User, (user) => user.vacationRequests, { eager: true })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "start_date", type: "date" })
  startDate!: string;

  @Column({ name: "end_date", type: "date" })
  endDate!: string;

  @Column({ type: "text", nullable: true })
  reason!: string | null;

  @Column({ type: "varchar", length: 20, default: "Pending" })
  status!: RequestStatus;

  @Column({ type: "text", nullable: true })
  comments!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;
}
