import { prisma } from "./prisma";
import type { Customer, Order } from "@prisma/client";

export type CustomerWithOrders = Customer & {
  orders: Order[];
};

export type CustomerWithUser = Customer & {
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export type CreateCustomerInput = {
  name: string;
  lastname: string;
  address?: string;
  dni: string;
  dob?: Date | string;
  userId: number;
};

export type UpdateCustomerInput = Partial<Omit<CreateCustomerInput, "dni" | "userId">>;

/**
 * Customer Service - CRUD operations for customers
 */
export class CustomerService {
  /**
   * Get all customers with pagination
   */
  static async getAll(params?: {
    page?: number;
    limit?: number;
    userId?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where = params?.userId ? { userId: params.userId } : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orders: {
            select: {
              id: true,
              status: true,
              totalAmount: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get customer by ID with orders
   */
  static async getById(id: number): Promise<CustomerWithOrders | null> {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orders: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  /**
   * Get customer by DNI
   */
  static async getByDni(dni: string): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { dni },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get all customers for a specific user
   */
  static async getByUserId(userId: number): Promise<Customer[]> {
    return prisma.customer.findMany({
      where: { userId },
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Last 5 orders
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Create a new customer
   */
  static async create(data: CreateCustomerInput): Promise<Customer> {
    // Check if DNI already exists
    const existing = await prisma.customer.findUnique({
      where: { dni: data.dni },
    });

    if (existing) {
      throw new Error("Ya existe un cliente con este DNI");
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return prisma.customer.create({
      data: {
        name: data.name,
        lastname: data.lastname,
        address: data.address,
        dni: data.dni,
        dob: data.dob ? new Date(data.dob) : null,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Update customer
   */
  static async update(
    id: number,
    data: UpdateCustomerInput
  ): Promise<Customer> {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new Error("Cliente no encontrado");
    }

    return prisma.customer.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.lastname && { lastname: data.lastname }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.dob && { dob: new Date(data.dob) }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Delete customer (soft delete by checking if has orders)
   */
  static async delete(id: number): Promise<{ success: boolean; message: string }> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });

    if (!customer) {
      throw new Error("Cliente no encontrado");
    }

    // Check if customer has orders
    if (customer.orders.length > 0) {
      return {
        success: false,
        message: `No se puede eliminar el cliente porque tiene ${customer.orders.length} orden(es) asociada(s)`,
      };
    }

    await prisma.customer.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Cliente eliminado exitosamente",
    };
  }

  /**
   * Search customers by name, lastname or DNI
   */
  static async search(query: string, userId?: number) {
    const where = {
      AND: [
        userId ? { userId } : {},
        {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { lastname: { contains: query, mode: "insensitive" as const } },
            { dni: { contains: query, mode: "insensitive" as const } },
          ],
        },
      ],
    };

    return prisma.customer.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get customer statistics
   */
  static async getStats(customerId: number) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: true,
      },
    });

    if (!customer) {
      throw new Error("Cliente no encontrado");
    }

    const totalOrders = customer.orders.length;
    const totalSpent = customer.orders.reduce(
      (sum, order) => sum + (order.totalAmount ? Number(order.totalAmount) : 0),
      0
    );

    const ordersByStatus = customer.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrders,
      totalSpent,
      averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
      ordersByStatus,
      lastOrderDate: customer.orders[0]?.createdAt || null,
    };
  }
}
