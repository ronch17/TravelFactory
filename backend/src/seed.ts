import { Repository } from "typeorm";
import { AppDataSource } from "./config/data-source";
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

export async function runSeed(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const userRepository = AppDataSource.getRepository(User);
    await seedUsers(userRepository);
    console.log("Seed completed");
  } finally {
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  runSeed().catch((error: unknown) => {
    console.error("Seed failed", error);
    process.exit(1);
  });
}
