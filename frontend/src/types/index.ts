export interface User {
  id: number;
  email: string;
  fullName: string;
  company: string;
  phone: string;
  role: 'FOURNISSEUR' | 'ACHETEUR';
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  fullName: string;
  user?: User;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  supplierId?: number;
}

export interface Offer {
  id: number;
  productId: number;
  productName?: string;
  buyerId?: number;
  buyerName?: string;
  supplierId?: number;
  proposedPrice: number;
  quantity: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  message?: string;
}

export interface Transaction {
  id: number;
  offerId?: number;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  date: string;
  description?: string;
  buyerName?: string;
  supplierName?: string;
}

export interface MonthlyStats {
  month: string;
  offers: number;
  revenue: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalOffers: number;
  acceptedOffers: number;
  totalRevenue: number;
  monthlyStats: MonthlyStats[];
}