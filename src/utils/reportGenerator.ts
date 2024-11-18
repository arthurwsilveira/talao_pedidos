import { Receipt, Seller, SalesReport } from '../types';
import { getReceipts } from './storage';

export const generateSalesReport = (
  seller: Seller,
  startDate: string,
  endDate: string
): SalesReport => {
  const allReceipts = getReceipts();
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Include the entire end date
  
  const receipts = allReceipts.filter(receipt => {
    const receiptDate = new Date(receipt.date);
    return (
      receipt.seller === seller.name &&
      receiptDate >= start &&
      receiptDate <= end
    );
  });

  const totalSales = receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0);
  const totalCommission = (totalSales * seller.commission) / 100;

  return {
    seller: seller.name,
    totalSales,
    totalCommission,
    receipts,
    startDate,
    endDate
  };
};