import React from 'react';
import { SalesReport } from '../types';

interface PrintableSalesReportProps {
  report: SalesReport;
}

const PrintableSalesReport = React.forwardRef<HTMLDivElement, PrintableSalesReportProps>(
  ({ report }, ref) => {
    if (!report) return null;

    return (
      <div
        ref={ref}
        className="p-8 bg-white max-w-4xl mx-auto print:shadow-none"
        style={{ printColorAdjust: 'exact' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">RELATÓRIO DE VENDAS</h1>
          <p className="text-lg text-gray-600 mt-2">{report.seller}</p>
          <p className="text-sm text-gray-500">
            {new Date(report.startDate).toLocaleDateString('pt-BR')} até{' '}
            {new Date(report.endDate).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3">Data</th>
              <th className="text-left py-3">Nº Recibo</th>
              <th className="text-right py-3">Valor</th>
            </tr>
          </thead>
          <tbody>
            {report.receipts.map((receipt) => (
              <tr key={receipt.id} className="border-b border-gray-200">
                <td className="py-3">{new Date(receipt.date).toLocaleDateString('pt-BR')}</td>
                <td className="py-3">#{String(receipt.receiptNumber).padStart(4, '0')}</td>
                <td className="py-3 text-right">R$ {receipt.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-300 pt-6">
          <div>
            <p className="font-semibold text-gray-700">Total em Vendas:</p>
            <p className="text-2xl font-bold text-blue-600">R$ {report.totalSales.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-700">Comissão Total:</p>
            <p className="text-2xl font-bold text-green-600">R$ {report.totalCommission.toFixed(2)}</p>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>Relatório gerado em {new Date().toLocaleDateString('pt-BR')}</p>
        </footer>
      </div>
    );
  }
);

PrintableSalesReport.displayName = 'PrintableSalesReport';

export default PrintableSalesReport;