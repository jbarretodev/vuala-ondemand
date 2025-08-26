import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import pool from "@/lib/db"

export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
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
    const existingUserResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )
    
    if (existingUserResult.rows.length > 0) {
      return NextResponse.json(
        { message: "Ya existe una cuenta con este correo electrónico." },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user in database
    const insertResult = await client.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, hashedPassword, 'user']
    )

    const newUser = insertResult.rows[0]
    
    return NextResponse.json(
      { 
        message: "Cuenta creada exitosamente.",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.created_at
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

