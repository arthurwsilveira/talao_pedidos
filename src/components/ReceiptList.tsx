import React from 'react';
import { Receipt } from '../types';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import PrintableReceipt from './PrintableReceipt';

interface ReceiptListProps {
  receipts: Receipt[];
}

export default function ReceiptList({ receipts }: ReceiptListProps) {
  const printableRef = React.useRef<HTMLDivElement>(null);
  const [selectedReceipt, setSelectedReceipt] = React.useState<Receipt | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    onAfterPrint: () => setSelectedReceipt(null),
  });

  if (receipts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recibos Salvos</h2>
      <div className="space-y-4">
        {receipts.map((receipt) => (
          <div
            key={receipt.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Recibo #{receipt.receiptNumber}</p>
                <p className="text-sm text-gray-600">
                  {new Date(receipt.date).toLocaleDateString('pt-BR')} - {receipt.seller}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-blue-600">
                  R$ {receipt.totalAmount.toFixed(2)}
                </p>
                <button
                  onClick={() => {
                    setSelectedReceipt(receipt);
                    setTimeout(handlePrint, 100);
                  }}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden">
        <PrintableReceipt ref={printableRef} receipt={selectedReceipt!} />
      </div>
    </div>
  );
}