import { Receipt } from '../types';

const STORAGE_KEY = 'receipts';
const LAST_NUMBERS_KEY = 'lastReceiptNumbers';

interface LastNumbers {
  [seller: string]: number;
}

export const getNextReceiptNumber = (seller: string): number => {
  const lastNumbers = JSON.parse(localStorage.getItem(LAST_NUMBERS_KEY) || '{}') as LastNumbers;
  const nextNumber = (lastNumbers[seller] || 1000) + 1;
  lastNumbers[seller] = nextNumber;
  localStorage.setItem(LAST_NUMBERS_KEY, JSON.stringify(lastNumbers));
  return nextNumber;
};

export const saveReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  const newReceipt = {
    ...receipt,
    id: crypto.randomUUID(),
  };
  receipts.push(newReceipt);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  
  // Update last receipt number for the seller
  const lastNumbers = JSON.parse(localStorage.getItem(LAST_NUMBERS_KEY) || '{}') as LastNumbers;
  lastNumbers[receipt.seller] = receipt.receiptNumber;
  localStorage.setItem(LAST_NUMBERS_KEY, JSON.stringify(lastNumbers));
};

export const getReceipts = (): Receipt[] => {
  const receipts = localStorage.getItem(STORAGE_KEY);
  return receipts ? JSON.parse(receipts) : [];
};

export const searchReceipts = (query: string, searchType: 'number' | 'date'): Receipt[] => {
  const receipts = getReceipts();
  
  if (searchType === 'number') {
    return receipts.filter(receipt => 
      receipt.receiptNumber.toString().includes(query)
    );
  } else {
    return receipts.filter(receipt => 
      receipt.date.includes(query)
    );
  }
};