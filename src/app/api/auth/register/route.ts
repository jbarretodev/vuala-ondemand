import { NextRequest, NextResponse } from "next/server"
// import bcrypt from "bcryptjs" // Uncomment after installing: pnpm add bcryptjs @types/bcryptjs

// Simple in-memory user storage for demo
// In production, replace this with your database
let users: Array<{
  id: string
  name: string
  email: string
  password: string
  role: string
  createdAt: Date
}> = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@vuala.com",
    password: "password", // Temporary plain text for demo
    role: "admin",
    createdAt: new Date()
  },
  {
    id: "2", 
    name: "Regular User",
    email: "user@vuala.com",
    password: "password", // Temporary plain text for demo
    role: "user",
    createdAt: new Date()
  }
]

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos." },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      )
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { message: "Correo electrónico inválido." },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
      return NextResponse.json(
        { message: "Ya existe una cuenta con este correo electrónico." },
        { status: 409 }
      )
    }

    // Temporary: Store password as-is for demo (install bcryptjs for production)
    // const hashedPassword = await bcrypt.hash(password, 12)
    const hashedPassword = password

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date()
    }

    users.push(newUser)

    // Return success (don't include password in response)
    const { password: _, ...userWithoutPassword } = newUser
    
    return NextResponse.json(
      { 
        message: "Cuenta creada exitosamente.",
        user: userWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 }
    )
  }
}

// Export users for use in NextAuth (in production, this would be a database query)
export { users }
