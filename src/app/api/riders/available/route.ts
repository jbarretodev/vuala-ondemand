import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { RiderService } from "@/lib/rider-service";

/**
 * GET /api/riders/available
 * Get all available riders (IDLE status and active)
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

    const riders = await RiderService.getAvailableRiders();

    return NextResponse.json({
      riders,
      count: riders.length,
    });
  } catch (error) {
    console.error("Error fetching available riders:", error);
    return NextResponse.json(
      { error: "Error al obtener repartidores disponibles" },
      { status: 500 }
    );
  }
}
