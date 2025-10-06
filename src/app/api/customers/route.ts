import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/customer-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET /api/customers
 * Get all customers with pagination and optional filtering by userId
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const userId = searchParams.get("userId");
    const search = searchParams.get("search");

    // If search query is provided
    if (search) {
      const customers = await CustomerService.search(
        search,
        userId ? parseInt(userId) : undefined
      );
      return NextResponse.json({ customers });
    }

    // Regular pagination
    const result = await CustomerService.getAll({
      page,
      limit,
      userId: userId ? parseInt(userId) : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customers
 * Create a new customer AND user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, lastname, address, dni, dob, username, email, password, roleId } = body;

    // Validation
    if (!name || !lastname || !dni) {
      return NextResponse.json(
        { error: "Nombre, apellido y DNI son requeridos" },
        { status: 400 }
      );
    }

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // DNI format validation (basic)
    if (dni.length < 5) {
      return NextResponse.json(
        { error: "DNI inválido" },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Check if username or email already exists
    const { prisma } = await import("@/lib/prisma");
    const bcrypt = await import("bcryptjs");

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El username o email ya está en uso" },
        { status: 409 }
      );
    }

    // Check if DNI already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { dni }
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Ya existe un cliente con este DNI" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and customer in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          username,
          name,
          email,
          password: hashedPassword,
          roleId: parseInt(roleId) || 2, // Default to customer role
        }
      });

      // Create customer
      const newCustomer = await tx.customer.create({
        data: {
          name,
          lastname,
          address,
          dni,
          dob: dob ? new Date(dob) : null,
          userId: newUser.id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              email: true,
              role: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          }
        }
      });

      return { user: newUser, customer: newCustomer };
    });

    return NextResponse.json(
      {
        message: "Cliente y usuario creados exitosamente",
        customer: result.customer,
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating customer:", error);
    
    return NextResponse.json(
      { error: error.message || "Error al crear cliente" },
      { status: 500 }
    );
  }
}
