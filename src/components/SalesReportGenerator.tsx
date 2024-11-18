import React, { useState } from 'react';
import { Seller, SalesReport as SalesReportType } from '../types';
import { generateSalesReport } from '../utils/reportGenerator';
import SalesReportDisplay from './SalesReport';
import PrintableSalesReport from './PrintableSalesReport';
import { useReactToPrint } from 'react-to-print';
import { updateSeller } from '../utils/sellerStorage';

interface SalesReportGeneratorProps {
  sellers: Seller[];
}

const SalesReportGenerator: React.FC<SalesReportGeneratorProps> = ({ sellers }) => {
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [commission, setCommission] = useState<number>(0);
  const [report, setReport] = useState<SalesReportType | null>(null);
  const printableRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
  });

  const handleSellerChange = (sellerId: string) => {
    setSelectedSeller(sellerId);
    const seller = sellers.find(s => s.id === sellerId);
    if (seller) {
      setCommission(seller.commission);
    }
  };

  const handleCommissionUpdate = () => {
    const seller = sellers.find(s => s.id === selectedSeller);
    if (seller && commission !== seller.commission) {
      const updatedSeller = { ...seller, commission };
      updateSeller(updatedSeller);
      alert('Comissão atualizada com sucesso!');
    }
  };

  const handleGenerateReport = () => {
    if (!selectedSeller || !startDate || !endDate) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const seller = sellers.find(s => s.id === selectedSeller);
    if (!seller) return;

    // Update seller with current commission before generating report
    const sellerWithCurrentCommission = { ...seller, commission };
    const generatedReport = generateSalesReport(sellerWithCurrentCommission, startDate, endDate);
    setReport(generatedReport);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Gerar Relatório de Vendas</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
          <select
            value={selectedSeller}
            onChange={(e) => handleSellerChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione um vendedor</option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comissão (%)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
              min="0"
              max="100"
              step="0.1"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCommissionUpdate}
              disabled={!selectedSeller}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleGenerateReport}
          disabled={!selectedSeller || !startDate || !endDate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Gerar Relatório
        </button>
      </div>

      {report && <SalesReportDisplay report={report} onPrint={handlePrint} />}

      <div className="hidden">
        <PrintableSalesReport ref={printableRef} report={report!} />
      </div>
    </div>
  );
};

export default SalesReportGenerator;