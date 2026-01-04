import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedAdmins() {
  const password = "Admin@123"; // CHANGE AFTER FIRST LOGIN
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.createMany({
    data: [
      {
        username: "admin1",
        phone: "9999999999",
        passwordHash,
        role: "SUPER_ADMIN",
      },
      {
        username: "admin2",
        phone: "8888888888",
        passwordHash,
        role: "ADMIN",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Admins seeded");
}

seedAdmins()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

