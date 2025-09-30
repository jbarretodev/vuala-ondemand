import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

    // Obtener el usuario de la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Parsear el body
    const body = await request.json();
    const {
      customerName,
      customerLastName,
      pickupAddress,
      deliveryAddress,
      isScheduled,
      scheduledDate,
      scheduledTime,
      distanceKm,
      estimatedTime,
      estimatedPrice,
    } = body;

    // Validaciones básicas
    if (!customerName || !customerLastName) {
      return NextResponse.json(
        { error: "Nombre y apellido son requeridos" },
        { status: 400 }
      );
    }

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
        userId: user.id,
        customerName,
        customerLastName,
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
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          customerName: order.customerName,
          customerLastName: order.customerLastName,
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

    // Obtener el usuario de la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Obtener las órdenes del usuario
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
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
