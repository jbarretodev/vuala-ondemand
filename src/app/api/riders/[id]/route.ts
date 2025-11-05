import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RiderService } from "@/lib/rider-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/riders/[id]
 * Get rider by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { id: paramId } = await context.params;
    const id = parseInt(paramId);
    const rider = await RiderService.getRiderById(id);

    if (!rider) {
      return NextResponse.json(
        { error: "Repartidor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ rider });
  } catch (error) {
    console.error("Error fetching rider:", error);
    return NextResponse.json(
      { error: "Error al obtener repartidor" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/riders/[id]
 * Update rider
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { id: paramId } = await context.params;
    const id = parseInt(paramId);
    const body = await request.json();

    // Update based on what's in the body
    if (body.status) {
      const rider = await RiderService.updateStatus(id, body.status);
      return NextResponse.json({
        message: "Estado actualizado",
        rider,
      });
    }

    if (body.hasOwnProperty('isActive')) {
      const rider = await RiderService.toggleActive(id);
      return NextResponse.json({
        message: "Estado de activación actualizado",
        rider,
      });
    }

    if (body.rating !== undefined) {
      const rider = await RiderService.updateRating(id, body.rating);
      return NextResponse.json({
        message: "Calificación actualizada",
        rider,
      });
    }

    if (body.vehicle) {
      const vehicle = await RiderService.updateVehicle(id, body.vehicle);
      return NextResponse.json({
        message: "Vehículo actualizado",
        vehicle,
      });
    }

    return NextResponse.json(
      { error: "No hay campos para actualizar" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Error updating rider:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al actualizar repartidor";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/riders/[id]
 * Delete rider
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      );
    }

    const { id: paramId } = await context.params;
    const id = parseInt(paramId);
    await RiderService.deleteRider(id);

    return NextResponse.json({
      message: "Repartidor eliminado exitosamente",
    });
  } catch (error: unknown) {
    console.error("Error deleting rider:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al eliminar repartidor";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
