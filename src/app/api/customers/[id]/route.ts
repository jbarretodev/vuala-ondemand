import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/customer-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET /api/customers/[id]
 * Get customer by ID with orders
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const customerId = parseInt(params.id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "ID de cliente inválido" },
        { status: 400 }
      );
    }

    const customer = await CustomerService.getById(customerId);

    if (!customer) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Error al obtener cliente" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/customers/[id]
 * Update customer
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const customerId = parseInt(params.id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "ID de cliente inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, lastname, address, dob } = body;

    const customer = await CustomerService.update(customerId, {
      name,
      lastname,
      address,
      dob,
    });

    return NextResponse.json({
      message: "Cliente actualizado exitosamente",
      customer,
    });
  } catch (error: any) {
    console.error("Error updating customer:", error);

    if (error.message.includes("no encontrado")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar cliente" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/customers/[id]
 * Delete customer AND associated user (only if no orders)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const customerId = parseInt(params.id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "ID de cliente inválido" },
        { status: 400 }
      );
    }

    // Get customer with orders to check
    const { prisma } = await import("@/lib/prisma");
    
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: true,
        user: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Check if customer has orders
    if (customer.orders.length > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar el cliente porque tiene ${customer.orders.length} orden(es) asociada(s)` },
        { status: 400 }
      );
    }

    // Delete customer and user in transaction
    // Note: User will be deleted automatically due to CASCADE on customer
    await prisma.customer.delete({
      where: { id: customerId },
    });

    // Delete the associated user
    await prisma.user.delete({
      where: { id: customer.userId },
    });

    return NextResponse.json({
      message: "Cliente y usuario eliminados exitosamente",
    });
  } catch (error: any) {
    console.error("Error deleting customer:", error);

    if (error.message.includes("no encontrado")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}
