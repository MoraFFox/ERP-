import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../../src/utils/password"

const prisma = new PrismaClient()

async function main() {
  // Add your seed data here
  console.log("Seeding database...")

  // Create initial role
  const userRole = await prisma.role.create({
    data: {
      name: "User",
      description: "Standard user role",
      permissions: ["READ_BASIC"], // Basic read permissions
    },
  })

  const hashedPassword = await hashPassword("password123")

  // Create a test user
  const testUser = await prisma.user.create({
    data: {
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      password: hashedPassword, // Use properly hashed password
      roleId: userRole.id,
    },
  })

  console.log("Created test user:", testUser)

  console.log("Seeding completed.")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
