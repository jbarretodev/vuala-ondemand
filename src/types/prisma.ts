// Prisma types - manually defined to avoid import issues
export interface Role {
  id: number
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: number
  username: string
  name: string
  email: string
  password: string
  roleId: number
  avatar: string | null
  providerId: string | null
  providerName: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: number
  name: string
  lastname: string
  address: string | null
  dni: string
  dob: Date | null
  userId: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: number
  customerId: number
  status: string
  pickupAddress: string | null
  deliveryAddress: string | null
  isScheduled: boolean
  scheduledDate: Date | null
  scheduledTime: string | null
  distanceKm: number | null
  estimatedTime: string | null
  estimatedPrice: number | null
  totalAmount: number | null
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
export interface UserWithRole extends User {
  role: Role
}

export interface UserWithCustomers extends User {
  customers: Customer[]
}

export interface CustomerWithUser extends Customer {
  user: Pick<User, 'id' | 'username' | 'name' | 'email'>
}

export interface OrderWithCustomer extends Order {
  customer: CustomerWithUser
}
