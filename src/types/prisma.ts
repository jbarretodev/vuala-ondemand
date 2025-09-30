// Prisma types - manually defined to avoid import issues
export interface User {
  id: number
  name: string
  email: string
  password: string
  role: string
  providerId: string | null
  providerName: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: number
  userId: number
  status: string
  totalAmount: number | null
  deliveryAddress: string | null
  createdAt: Date
  updatedAt: Date
}

export interface DeliveryPartner {
  id: number
  name: string
  email: string
  phone: string | null
  status: string
  createdAt: Date
}

// Extended types with relations
export interface UserWithOrders extends User {
  orders: Order[]
}

export interface OrderWithUser extends Order {
  user: Pick<User, 'id' | 'name' | 'email'>
}
