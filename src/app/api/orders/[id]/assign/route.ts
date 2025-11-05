import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RiderService } from "@/lib/rider-service";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/orders/[id]/assign
 * Assign a rider to an order manually
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "ID de orden inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { riderId } = body;

    if (!riderId) {
      return NextResponse.json(
        { error: "ID de rider requerido" },
        { status: 400 }
      );
    }

    // Verificar que la orden existe
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que la orden está pendiente
    if (order.status !== "pending") {
      return NextResponse.json(
        { error: `La orden está en estado: ${order.status}. Solo se pueden asignar órdenes pendientes.` },
        { status: 400 }
      );
    }

    // Verificar que el rider existe y está disponible
    const rider = await prisma.rider.findUnique({
      where: { id: parseInt(riderId) },
      include: {
        user: true,
        vehicle: true,
      },
    });

    if (!rider) {
      return NextResponse.json(
        { error: "Rider no encontrado" },
        { status: 404 }
      );
    }

    if (!rider.isActive) {
      return NextResponse.json(
        { error: "El rider no está activo" },
        { status: 400 }
      );
    }

    if (rider.status === "ON_DELIVERY") {
      return NextResponse.json(
        { error: "El rider ya está en una entrega" },
        { status: 400 }
      );
    }

    // Asignar la orden al rider usando el servicio
    const assignedOrder = await RiderService.assignOrder(
      parseInt(riderId),
      orderId
    );

    return NextResponse.json({
      success: true,
      message: "Orden asignada correctamente",
      order: {
        id: assignedOrder?.id,
        status: assignedOrder?.status,
        customer: {
          name: assignedOrder?.customer?.name || "",
          lastname: assignedOrder?.customer?.lastname || "",
        },
        rider: assignedOrder?.rider ? {
          id: assignedOrder.rider.id,
          name: assignedOrder.rider.user?.name || "",
          email: assignedOrder.rider.user?.email || "",
          phone: assignedOrder.rider.phone,
          vehicle: assignedOrder.rider.vehicle || null,
        } : null,
        pickupAddress: assignedOrder?.pickupAddress || "",
        deliveryAddress: assignedOrder?.deliveryAddress || "",
      },
    });
  } catch (error) {
    console.error("Error assigning order:", error);
    return NextResponse.json(
      { error: "Error al asignar la orden" },
      { status: 500 }
    );
  }
}
