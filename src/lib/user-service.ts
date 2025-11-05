import { prisma } from './prisma'
import type { User, Order, DeliveryPartner } from '../types/prisma'
import bcrypt from 'bcryptjs'

// User Service
export class UserService {
  static async createUser(data: {
    username: string;
    name: string;
    email: string;
    password: string;
    roleId?: number;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    return prisma.user.create({
      data: {
        username: data.username,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roleId: data.roleId || 2, // default to customer
      },
    });
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        customers: true,
      },
    });
  }

  static async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          _count: {
            select: { customers: true },
          },
        },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  static async updateUser(id: number, data: {
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    roleId?: number;
    avatar?: string | null;
    providerId?: string | null;
    providerName?: string | null;
  }) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

// Order Service
export class OrderService {
  static async createOrder(data: {
    customerId: number;
    totalAmount?: number;
    deliveryAddress?: string;
    pickupAddress?: string;
    status?: string;
  }) {
    return prisma.order.create({
      data,
      include: {
        customer: {
          select: { 
            id: true, 
            name: true, 
            lastname: true,
            user: {
              select: { email: true }
            }
          },
        },
      },
    });
  }

  static async getOrderById(id: number) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: { 
            id: true, 
            name: true, 
            lastname: true,
            user: {
              select: { email: true }
            }
          },
        },
      },
    });
  }

  static async getOrdersByCustomer(customerId: number) {
    return prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllOrders(filters?: {
    status?: string;
    customerId?: number;
    page?: number;
    limit?: number;
  }) {
    const { status, customerId, page = 1, limit = 10 } = filters || {};
    const skip = (page - 1) * limit;

    const where: { status?: string; customerId?: number } = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: {
            select: { 
              id: true, 
              name: true, 
              lastname: true,
              user: {
                select: { email: true }
              }
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  static async updateOrderStatus(id: number, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}

// Delivery Partner Service
export class DeliveryPartnerService {
  static async createPartner(data: {
    name: string;
    email: string;
    phone?: string;
  }) {
    return prisma.deliveryPartner.create({
      data,
    });
  }

  static async getAllPartners() {
    return prisma.deliveryPartner.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getPartnerById(id: number) {
    return prisma.deliveryPartner.findUnique({
      where: { id },
    });
  }

  static async updatePartnerStatus(id: number, status: string) {
    return prisma.deliveryPartner.update({
      where: { id },
      data: { status },
    });
  }
}

// Analytics Service
export class AnalyticsService {
  static async getDashboardStats() {
    const [
      totalUsers,
      totalOrders,
      totalPartners,
      pendingOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.deliveryPartner.count({ where: { status: "active" } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: { 
              name: true, 
              lastname: true,
              user: {
                select: { email: true }
              }
            },
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalPartners,
      pendingOrders,
      recentOrders,
    };
  }
}
