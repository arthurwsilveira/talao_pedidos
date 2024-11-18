import { Receipt, Seller } from '../types';
import { getReceipts } from './storage';

const SELLERS_KEY = 'sellers';

export const createSeller = (seller: Omit<Seller, 'id'>): Seller => {
  const sellers = getSellers();
  const newSeller: Seller = {
    ...seller,
    id: crypto.randomUUID()
  };
  
  sellers.push(newSeller);
  localStorage.setItem(SELLERS_KEY, JSON.stringify(sellers));
  return newSeller;
};

export const updateSeller = (seller: Seller): void => {
  const sellers = getSellers();
  const index = sellers.findIndex(s => s.id === seller.id);
  if (index !== -1) {
    sellers[index] = seller;
    localStorage.setItem(SELLERS_KEY, JSON.stringify(sellers));
  }
};

export const deleteSeller = (sellerId: string): void => {
  const sellers = getSellers();
  const filteredSellers = sellers.filter(s => s.id !== sellerId);
  localStorage.setItem(SELLERS_KEY, JSON.stringify(filteredSellers));
};

export const getSellers = (): Seller[] => {
  const sellers = localStorage.getItem(SELLERS_KEY);
  return sellers ? JSON.parse(sellers) : [];
};

export const getSellerByReceiptNumber = (receiptNumber: number): Seller | undefined => {
  const sellers = getSellers();
  return sellers.find(
    seller => 
      seller.active && 
      receiptNumber >= seller.startRange && 
      receiptNumber <= seller.endRange
  );
};

export const isRangeAvailable = (start: number, end: number, excludeSellerId?: string): boolean => {
  const sellers = getSellers();
  return !sellers.some(seller => 
    seller.id !== excludeSellerId && (
      (start >= seller.startRange && start <= seller.endRange) ||
      (end >= seller.startRange && end <= seller.endRange) ||
      (start <= seller.startRange && end >= seller.endRange)
    )
  );
};

export const validateReceiptNumber = (receiptNumber: number, sellerId: string): boolean => {
  const seller = getSellers().find(s => s.id === sellerId);
  if (!seller) return false;
  return receiptNumber >= seller.startRange && receiptNumber <= seller.endRange;
};

export const getNextAvailableNumber = (sellerId: string): number | null => {
  const seller = getSellers().find(s => s.id === sellerId);
  if (!seller) return null;

  const receipts = getReceipts();
  const usedNumbers = new Set(
    receipts
      .filter(r => r.seller === seller.name)
      .map(r => r.receiptNumber)
  );

  for (let i = seller.startRange; i <= seller.endRange; i++) {
    if (!usedNumbers.has(i)) {
      return i;
    }
  }

  return null;
};