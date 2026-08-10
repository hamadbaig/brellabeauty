import 'dotenv/config'
import { connectDB } from '../lib/mongodb'
import { AdminUserModel } from '../models/AdminUser'
import bcrypt from 'bcryptjs'

async function seedAdmin() {
  try {
    await connectDB()
    console.log('✓ Connected to MongoDB')

    const email = 'admin@brellabeauty.com'
    const password = 'admin123'
    const name = 'Brella Admin'

    const existing = await AdminUserModel.findOne({ email })
    if (existing) {
      console.log('✓ Admin user already exists')
      console.log('  Email:', email)
      console.log('  Password:', password)
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await AdminUserModel.create({
      email,
      password: hashedPassword,
      name,
      role: 'superadmin',
    })

    console.log('✓ Admin user created successfully')
    console.log('  Email:', email)
    console.log('  Password:', password)
    console.log('\n  Login at: http://localhost:3000/admin/login')
    process.exit(0)
  } catch (error) {
    console.error('✗ Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin()
