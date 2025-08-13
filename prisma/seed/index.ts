import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Add your seed data here
  console.log('Seeding database...')

  // Create initial role
  const userRole = await prisma.role.create({
    data: {
      name: 'User',
      description: 'Standard user role',
      permissions: ['READ_BASIC'] // Basic read permissions
    }
  })

  // Create a test user
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'hashed_password_here', // In production, ensure this is properly hashed
      roleId: userRole.id
    }
  })

  console.log('Created test user:', testUser)

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
