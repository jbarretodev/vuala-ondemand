import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

// Helper function to split full name into first and last name
function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }
  
  // If 2 parts: firstName lastName
  if (parts.length === 2) {
    return { firstName: parts[0], lastName: parts[1] };
  }
  
  // If 3+ parts: firstName middleName(s) lastName
  // Take first as firstName, rest as lastName
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  
  return { firstName, lastName };
}

// Helper function to generate unique username
async function generateUsername(email: string, name: string): Promise<string> {
  // Try email prefix first
  let baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Check if exists
  let username = baseUsername;
  let counter = 1;
  
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  
  return username;
}

// Helper function to generate unique DNI
async function generateUniqueDNI(userId: number): Promise<string> {
  const timestamp = Date.now();
  const dni = `DNI-${userId}-${timestamp}`;
  
  // Verify it's unique
  const existing = await prisma.customer.findUnique({ where: { dni } });
  if (existing) {
    return `DNI-${userId}-${timestamp}-${Math.random().toString(36).substr(2, 5)}`;
  }
  
  return dni;
}

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

    // Check if user already exists using Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: "Ya existe una cuenta con este correo electrónico." },
        { status: 409 }
      )
    }

    // Split full name into first and last name
    const { firstName, lastName } = splitFullName(name);

    // Generate unique username
    const username = await generateUsername(email, name);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user AND customer in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          username,
          name: firstName,
          email,
          password: hashedPassword,
          role: 'user'
        }
      });

      // Generate unique DNI for customer
      const dni = await generateUniqueDNI(newUser.id);

      // Create associated customer
      const newCustomer = await tx.customer.create({
        data: {
          name: firstName,
          lastname: lastName,
          dni,
          userId: newUser.id
        }
      });

      return { user: newUser, customer: newCustomer };
    });
    
    return NextResponse.json(
      { 
        message: "Cuenta creada exitosamente.",
        user: {
          id: result.user.id,
          username: result.user.username,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          createdAt: result.user.createdAt
        },
        customer: {
          id: result.customer.id,
          name: result.customer.name,
          lastname: result.customer.lastname,
          dni: result.customer.dni
        }
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: error.message || "Error interno del servidor." },
      { status: 500 }
    )
  }
}

