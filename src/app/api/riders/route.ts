import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RiderService } from "@/lib/rider-service";
import { RiderStatus, VehicleType } from "@prisma/client";

/**
 * GET /api/riders
 * Get all riders with pagination and filters
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
    const status = searchParams.get("status") as RiderStatus | null;
    const isActive = searchParams.get("isActive");

    const filters: { page: number; limit: number; status?: RiderStatus; isActive?: boolean } = { page, limit };
    if (status) filters.status = status;
    if (isActive !== null) filters.isActive = isActive === "true";

    const result = await RiderService.getAllRiders(filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching riders:", error);
    return NextResponse.json(
      { error: "Error al obtener repartidores" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/riders
 * Create a new rider
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

    // Only admin can create riders
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permisos para crear repartidores" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, phone, licenseNumber, vehicle } = body;

    // Validation
    if (!userId || !phone) {
      return NextResponse.json(
        { error: "userId y phone son requeridos" },
        { status: 400 }
      );
    }

    const riderData: {
      userId: number;
      phone: string;
      licenseNumber?: string;
      vehicleData?: { type: VehicleType; brand?: string; model?: string; year?: number; licensePlate: string; color?: string };
    } = {
      userId: parseInt(userId),
      phone,
      licenseNumber,
    };

    if (vehicle) {
      riderData.vehicleData = {
        type: vehicle.type as VehicleType,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year ? parseInt(vehicle.year) : undefined,
        licensePlate: vehicle.licensePlate,
        color: vehicle.color,
      };
    }

    const rider = await RiderService.createRider(riderData);

    return NextResponse.json(
      {
        message: "Repartidor creado exitosamente",
        rider,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating rider:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al crear repartidor";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
