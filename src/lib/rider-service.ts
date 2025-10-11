import { prisma } from './prisma';
import { RiderStatus, VehicleType } from '@prisma/client';

// Rider Service - gestión de repartidores
export class RiderService {
  /**
   * Create a new rider profile for a user
   */
  static async createRider(data: {
    userId: number;
    phone: string;
    licenseNumber?: string;
    vehicleData?: {
      type: VehicleType;
      brand?: string;
      model?: string;
      year?: number;
      licensePlate: string;
      color?: string;
    };
  }) {
    return prisma.rider.create({
      data: {
        userId: data.userId,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        vehicle: data.vehicleData
          ? {
              create: data.vehicleData,
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        vehicle: true,
      },
    });
  }

  /**
   * Get rider by ID with all relations
   */
  static async getRiderById(id: number) {
    return prisma.rider.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        vehicle: true,
        lastLocation: true,
        _count: {
          select: { orders: true },
        },
      },
    });
  }

  /**
   * Get rider by user ID
   */
  static async getRiderByUserId(userId: number) {
    return prisma.rider.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        vehicle: true,
        lastLocation: true,
      },
    });
  }

  /**
   * Get all riders with pagination and filters
   */
  static async getAllRiders(filters?: {
    status?: RiderStatus;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { status, isActive, page = 1, limit = 10 } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (isActive !== undefined) where.isActive = isActive;

    const [riders, total] = await Promise.all([
      prisma.rider.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          vehicle: true,
          lastLocation: true,
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.rider.count({ where }),
    ]);

    return {
      riders,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  /**
   * Get available riders (IDLE status and active)
   */
  static async getAvailableRiders() {
    return prisma.rider.findMany({
      where: {
        status: RiderStatus.IDLE,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        vehicle: true,
        lastLocation: true,
      },
      orderBy: { rating: 'desc' },
    });
  }

  /**
   * Update rider status
   */
  static async updateStatus(id: number, status: RiderStatus) {
    return prisma.rider.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Toggle rider active status
   */
  static async toggleActive(id: number) {
    const rider = await prisma.rider.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!rider) throw new Error('Rider not found');

    return prisma.rider.update({
      where: { id },
      data: { isActive: !rider.isActive },
    });
  }

  /**
   * Update rider location (both last and history)
   */
  static async updateLocation(
    riderId: number,
    locationData: {
      lat: number;
      lng: number;
      speed?: number;
      heading?: number;
      accuracy?: number;
      battery?: number;
      source?: string;
    }
  ) {
    const timestamp = new Date();

    // Update in transaction to ensure consistency
    return prisma.$transaction(async (tx) => {
      // Update or create last location
      await tx.riderLastLocation.upsert({
        where: { riderId },
        create: {
          riderId,
          ...locationData,
          timestamp,
        },
        update: {
          ...locationData,
          timestamp,
        },
      });

      // Create location history record
      await tx.riderLocation.create({
        data: {
          riderId,
          lat: locationData.lat,
          lng: locationData.lng,
          speed: locationData.speed,
          heading: locationData.heading,
          accuracy: locationData.accuracy,
          timestamp,
        },
      });

      return tx.rider.findUnique({
        where: { id: riderId },
        include: {
          lastLocation: true,
        },
      });
    });
  }

  /**
   * Get rider location history
   */
  static async getLocationHistory(
    riderId: number,
    filters?: {
      from?: Date;
      to?: Date;
      limit?: number;
    }
  ) {
    const { from, to, limit = 100 } = filters || {};

    const where: any = { riderId };
    if (from || to) {
      where.timestamp = {};
      if (from) where.timestamp.gte = from;
      if (to) where.timestamp.lte = to;
    }

    return prisma.riderLocation.findMany({
      where,
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Update rider vehicle
   */
  static async updateVehicle(
    riderId: number,
    vehicleData: {
      type?: VehicleType;
      brand?: string;
      model?: string;
      year?: number;
      licensePlate?: string;
      color?: string;
    }
  ) {
    const rider = await prisma.rider.findUnique({
      where: { id: riderId },
      include: { vehicle: true },
    });

    if (!rider) throw new Error('Rider not found');

    if (rider.vehicle) {
      // Update existing vehicle
      return prisma.vehicle.update({
        where: { riderId },
        data: vehicleData,
      });
    } else {
      // Create new vehicle
      return prisma.vehicle.create({
        data: {
          riderId,
          type: vehicleData.type || VehicleType.MOTORCYCLE,
          brand: vehicleData.brand,
          model: vehicleData.model,
          year: vehicleData.year,
          licensePlate: vehicleData.licensePlate || '',
          color: vehicleData.color,
        },
      });
    }
  }

  /**
   * Assign order to rider
   */
  static async assignOrder(riderId: number, orderId: number) {
    return prisma.$transaction(async (tx) => {
      // Update order with rider
      await tx.order.update({
        where: { id: orderId },
        data: { riderId },
      });

      // Update rider status to ON_DELIVERY
      await tx.rider.update({
        where: { id: riderId },
        data: { status: RiderStatus.ON_DELIVERY },
      });

      return tx.order.findUnique({
        where: { id: orderId },
        include: {
          customer: {
            select: {
              name: true,
              lastname: true,
            },
          },
          rider: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
              vehicle: true,
            },
          },
        },
      });
    });
  }

  /**
   * Complete order delivery
   */
  static async completeOrder(riderId: number, orderId: number) {
    return prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'delivered' },
      });

      // Increment completed orders and set rider to IDLE
      await tx.rider.update({
        where: { id: riderId },
        data: {
          status: RiderStatus.IDLE,
          completedOrders: { increment: 1 },
        },
      });

      return tx.rider.findUnique({
        where: { id: riderId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
    });
  }

  /**
   * Update rider rating
   */
  static async updateRating(riderId: number, rating: number) {
    if (rating < 0 || rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }

    return prisma.rider.update({
      where: { id: riderId },
      data: { rating },
    });
  }

  /**
   * Delete rider
   */
  static async deleteRider(id: number) {
    return prisma.rider.delete({
      where: { id },
    });
  }
}
