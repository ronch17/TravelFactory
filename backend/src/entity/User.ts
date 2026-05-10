import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { UserRole } from "../config/constants";
import { VacationRequest } from "./VacationRequest";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 20 })
  role!: UserRole;

  @OneToMany(() => VacationRequest, (request) => request.user)
  vacationRequests!: VacationRequest[];
}
