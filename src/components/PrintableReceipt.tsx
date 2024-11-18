import React from 'react';
import { Receipt } from '../types';

interface PrintableReceiptProps {
  receipt: Receipt;
}

const PrintableReceipt = React.forwardRef<HTMLDivElement, PrintableReceiptProps>(
  ({ receipt }, ref) => {
    if (!receipt) return null;

    return (
      <div 
        ref={ref} 
        className="p-8 bg-white max-w-4xl mx-auto print:shadow-none"
        style={{ printColorAdjust: 'exact' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">RECIBO DE VENDA</h1>
          <p className="text-lg text-gray-600 mt-2">#{String(receipt.receiptNumber).padStart(4, '0')}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="border-r border-gray-200 pr-8">
            <p className="font-semibold text-gray-700">Data:</p>
            <p className="text-lg">{new Date(receipt.date).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="pl-8">
            <p className="font-semibold text-gray-700">Vendedor:</p>
            <p className="text-lg">{receipt.seller}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Ordem</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Descrição</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Qtd</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Preço Unit.</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {receipt.products.map((product, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 px-4">{product.order}</td>
                <td className="py-4 px-4">{product.description}</td>
                <td className="text-right py-4 px-4">{product.quantity}</td>
                <td className="text-right py-4 px-4">R$ {product.unitPrice.toFixed(2)}</td>
                <td className="text-right py-4 px-4 font-medium">R$ {product.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right border-t-2 border-gray-300 pt-6">
          <p className="text-2xl font-bold text-gray-800">
            Total: R$ {receipt.totalAmount.toFixed(2)}
          </p>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>Obrigado pela preferência!</p>
          <p className="text-sm mt-2">{new Date().toLocaleDateString('pt-BR')}</p>
        </footer>
      </div>
    );
  }
);

PrintableReceipt.displayName = 'PrintableReceipt';

export default PrintableReceipt;