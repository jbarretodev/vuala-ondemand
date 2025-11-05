import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Obtener el usuario de la base de datos con su cliente asociado
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        customers: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el usuario tenga un cliente asociado
    if (!user.customers || user.customers.length === 0) {
      return NextResponse.json(
        { error: "No hay cliente asociado a este usuario" },
        { status: 400 }
      );
    }

    const customer = user.customers[0];

    // Parsear el body
    const body = await request.json();
    const {
      pickupAddress,
      deliveryAddress,
      isScheduled,
      scheduledDate,
      scheduledTime,
      distanceKm,
      estimatedTime,
      estimatedPrice,
    } = body;

    if (!pickupAddress || !deliveryAddress) {
      return NextResponse.json(
        { error: "Direcciones de recogida y entrega son requeridas" },
        { status: 400 }
      );
    }

    if (!distanceKm || !estimatedTime || !estimatedPrice) {
      return NextResponse.json(
        { error: "Información de ruta incompleta" },
        { status: 400 }
      );
    }

    // Validar fecha programada si es necesario
    if (isScheduled && (!scheduledDate || !scheduledTime)) {
      return NextResponse.json(
        { error: "Fecha y hora son requeridas para órdenes programadas" },
        { status: 400 }
      );
    }

    // Crear la orden
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        pickupAddress,
        deliveryAddress,
        isScheduled: isScheduled || false,
        scheduledDate: isScheduled && scheduledDate ? new Date(scheduledDate) : null,
        scheduledTime: isScheduled ? scheduledTime : null,
        distanceKm: parseFloat(distanceKm),
        estimatedTime,
        estimatedPrice: parseFloat(estimatedPrice),
        totalAmount: parseFloat(estimatedPrice), // Por ahora el total es igual al precio estimado
        status: "pending",
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            lastname: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          customer: {
            name: order.customer.name,
            lastname: order.customer.lastname,
          },
          pickupAddress: order.pickupAddress,
          deliveryAddress: order.deliveryAddress,
          isScheduled: order.isScheduled,
          scheduledDate: order.scheduledDate,
          scheduledTime: order.scheduledTime,
          distanceKm: order.distanceKm,
          estimatedTime: order.estimatedTime,
          estimatedPrice: order.estimatedPrice,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error al crear la orden" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Obtener parámetros de query
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const all = searchParams.get("all") === "true"; // Para admin, obtener todas las órdenes

    // Construir filtros
    const where: { customerId?: number | { in: number[] }; status?: string } = {};
    
    if (!all) {
      // Obtener el usuario de la base de datos con sus clientes
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          customers: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Usuario no encontrado" },
          { status: 404 }
        );
      }

      if (!user.customers || user.customers.length === 0) {
        return NextResponse.json({ orders: [] }, { status: 200 });
      }

      const customerIds = user.customers.map(c => c.id);
      where.customerId = { in: customerIds };
    }

    // Filtrar por status si se especifica
    if (status) {
      where.status = status;
    }

    // Obtener las órdenes
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            lastname: true,
          },
        },
        rider: {
          select: {
            id: true,
            phone: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            vehicle: true,
          },
        },
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error al obtener las órdenes" },
      { status: 500 }
    );
  }
}
