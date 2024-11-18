export interface Product {
  order: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Receipt {
  id?: string;
  receiptNumber: number;
  date: string;
  seller: string;
  products: Product[];
  totalAmount: number;
}

export interface Seller {
  id?: string;
  name: string;
  startRange: number;
  endRange: number;
  active: boolean;
  commission: number;
  createdAt?: string;
}

export interface SalesReport {
  seller: string;
  totalSales: number;
  totalCommission: number;
  receipts: Receipt[];
  startDate: string;
  endDate: string;
}