import React from 'react';
import { SalesReport } from '../types';
import { Printer } from 'lucide-react';

interface SalesReportProps {
  report: SalesReport;
  onPrint: () => void;
}

const SalesReportDisplay: React.FC<SalesReportProps> = ({ report, onPrint }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Relatório de Vendas</h2>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Printer className="w-4 h-4" />
          Imprimir Relatório
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Vendedor</p>
          <p className="font-medium">{report.seller}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Período</p>
          <p className="font-medium">
            {new Date(report.startDate).toLocaleDateString('pt-BR')} até{' '}
            {new Date(report.endDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2">Data</th>
              <th className="text-left py-2">Nº Recibo</th>
              <th className="text-right py-2">Valor</th>
            </tr>
          </thead>
          <tbody>
            {report.receipts.map((receipt) => (
              <tr key={receipt.id} className="border-b border-gray-100">
                <td className="py-2">{new Date(receipt.date).toLocaleDateString('pt-BR')}</td>
                <td className="py-2">#{String(receipt.receiptNumber).padStart(4, '0')}</td>
                <td className="py-2 text-right">R$ {receipt.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Total em Vendas</p>
          <p className="text-xl font-bold text-blue-600">R$ {report.totalSales.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Comissão Total</p>
          <p className="text-xl font-bold text-green-600">R$ {report.totalCommission.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesReportDisplay;