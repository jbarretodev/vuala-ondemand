import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/customer-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/customers/[id]/stats
 * Get customer statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const customerId = parseInt(id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "ID de cliente inválido" },
        { status: 400 }
      );
    }

    const stats = await CustomerService.getStats(customerId);

    return NextResponse.json({ stats });
  } catch (error: unknown) {
    console.error("Error fetching customer stats:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al obtener estadísticas del cliente";
    if (errorMessage.includes("no encontrado")) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al obtener estadísticas del cliente" },
      { status: 500 }
    );
  }
}
