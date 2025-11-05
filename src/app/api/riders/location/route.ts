import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RiderService } from "@/lib/rider-service";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/riders/location
 * Update rider location (requires rider to be authenticated)
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

    // Check if user is a rider
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { riders: true },
    });

    if (!user || !user.riders || user.riders.length === 0) {
      return NextResponse.json(
        { error: "Usuario no es un repartidor" },
        { status: 403 }
      );
    }

    const rider = user.riders[0];

    const body = await request.json();
    const { lat, lng, speed, heading, accuracy, battery, source } = body;

    // Validation
    if (lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: "lat y lng son requeridos" },
        { status: 400 }
      );
    }

    const updatedRider = await RiderService.updateLocation(rider.id, {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      speed: speed ? parseFloat(speed) : undefined,
      heading: heading ? parseFloat(heading) : undefined,
      accuracy: accuracy ? parseFloat(accuracy) : undefined,
      battery: battery ? parseInt(battery) : undefined,
      source,
    });

    return NextResponse.json({
      message: "Ubicación actualizada",
      rider: updatedRider,
    });
  } catch (error: unknown) {
    console.error("Error updating location:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al actualizar ubicación";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/riders/location?riderId=X
 * Get rider location history
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
    const riderId = searchParams.get("riderId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = searchParams.get("limit");

    if (!riderId) {
      return NextResponse.json(
        { error: "riderId es requerido" },
        { status: 400 }
      );
    }

    const filters: { from?: Date; to?: Date; limit?: number } = {};
    if (from) filters.from = new Date(from);
    if (to) filters.to = new Date(to);
    if (limit) filters.limit = parseInt(limit);

    const history = await RiderService.getLocationHistory(
      parseInt(riderId),
      filters
    );

    return NextResponse.json({ history });
  } catch (error: unknown) {
    console.error("Error fetching location history:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al obtener historial de ubicación";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
