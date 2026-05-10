import { Repository } from "typeorm";
import { User } from "./entity/User";

const DEFAULT_USERS: Pick<User, "name" | "role">[] = [
  { name: "Dana Requester", role: "Requester" },
  { name: "Roi Requester", role: "Requester" },
  { name: "Maya Validator", role: "Validator" },
];

export async function seedUsers(
  userRepository: Repository<User>,
): Promise<void> {
  const existingUsersCount = await userRepository.count();
  if (existingUsersCount > 0) {
    return;
  }

  const newUsers = userRepository.create(DEFAULT_USERS);
  await userRepository.save(newUsers);
}
