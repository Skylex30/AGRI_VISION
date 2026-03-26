export type UserRole = 'farmer' | 'buyer' | 'logistics';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  farmerId: string;
  location: string;
  image?: string;
}

export interface Transaction {
  id: string;
  productId: string;
  buyerId: string;
  farmerId: string;
  logisticsId?: string;
  status: 'pending' | 'shipped' | 'delivered';
  amount: number;
  timestamp: number;
}

export interface SeedAnalysis {
  quality: 'Good' | 'Medium' | 'Bad';
  confidence: number;
  features: string[];
  recommendation: string;
}

export interface CropAnalysis {
  status: 'Healthy' | 'Affected';
  issues: string[];
  severity: 'Low' | 'Medium' | 'High';
  recommendation: string;
}
