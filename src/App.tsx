import React, { useState, useRef, useEffect } from 'react';
import { Receipt as ReceiptIcon, Printer, Save, List, AlertCircle, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import PrintableReceipt from './components/PrintableReceipt';
import ProductRow from './components/ProductRow';
import ReceiptList from './components/ReceiptList';
import SearchReceipts from './components/SearchReceipts';
import SellerManagement from './components/SellerManagement';
import SalesReportGenerator from './components/SalesReportGenerator';
import { Product, Receipt, Seller } from './types';
import { saveReceipt, getReceipts, searchReceipts } from './utils/storage';
import { getSellers, validateReceiptNumber, getNextAvailableNumber } from './utils/sellerStorage';

function App() {
  const [receiptNumber, setReceiptNumber] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([
    { order: '', description: '', quantity: 0, unitPrice: 0, total: 0 },
  ]);
  const [savedReceipts, setSavedReceipts] = useState<Receipt[]>([]);
  const [showReceipts, setShowReceipts] = useState(false);
  const [showSellerManagement, setShowSellerManagement] = useState(false);
  const [showSalesReport, setShowSalesReport] = useState(false);
  const [searchType, setSearchType] = useState<'number' | 'date'>('number');
  const [error, setError] = useState('');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [lastSavedReceipt, setLastSavedReceipt] = useState<Receipt | null>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const printableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSellers();
  }, []);

  useEffect(() => {
    if (showSellerManagement) {
      loadSellers();
    }
  }, [showSellerManagement]);

  const loadSellers = () => {
    const loadedSellers = getSellers();
    setSellers(loadedSellers);
  };

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    onAfterPrint: () => {
      setShowPrintDialog(false);
      setLastSavedReceipt(null);
    },
  });

  const addProduct = () => {
    if (products.length < 5) {
      setProducts([...products, { order: '', description: '', quantity: 0, unitPrice: 0, total: 0 }]);
    }
  };

  const updateProduct = (index: number, field: keyof Product, value: string | number) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: value,
      total: field === 'quantity' || field === 'unitPrice' 
        ? Number(field === 'quantity' ? value : newProducts[index].quantity) * 
          Number(field === 'unitPrice' ? value : newProducts[index].unitPrice)
        : newProducts[index].total
    };
    setProducts(newProducts);
  };

  const totalAmount = products.reduce((sum, product) => sum + product.total, 0);

  const handleSave = () => {
    setError('');

    if (!selectedSeller) {
      setError('Por favor, selecione um vendedor.');
      return;
    }

    if (!validateReceiptNumber(receiptNumber, selectedSeller.id!)) {
      setError(`Número de talão inválido para o vendedor selecionado. Use números entre ${
        selectedSeller.startRange} e ${selectedSeller.endRange}.`);
      return;
    }

    if (products.some(p => !p.description.trim() || p.quantity <= 0 || p.unitPrice <= 0)) {
      setError('Por favor, preencha todos os campos dos produtos corretamente.');
      return;
    }

    const receipt: Receipt = {
      receiptNumber,
      date,
      seller: selectedSeller.name,
      products,
      totalAmount,
    };

    try {
      saveReceipt(receipt);
      setLastSavedReceipt(receipt);
      setShowPrintDialog(true);
      
      // Set next available number for the current seller
      const nextNumber = getNextAvailableNumber(selectedSeller.id!);
      if (nextNumber) {
        setReceiptNumber(nextNumber);
      } else {
        setReceiptNumber(0);
        setSelectedSeller(null);
      }
      
      setProducts([{ order: '', description: '', quantity: 0, unitPrice: 0, total: 0 }]);
      setDate(new Date().toISOString().split('T')[0]);
      
      loadReceipts();
    } catch (error) {
      console.error('Erro ao salvar recibo:', error);
      setError('Erro ao salvar recibo. Por favor, tente novamente.');
    }
  };

  const loadReceipts = () => {
    const receipts = getReceipts();
    setSavedReceipts(receipts);
    setShowReceipts(true);
    setShowSellerManagement(false);
    setShowSalesReport(false);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      loadReceipts();
      return;
    }
    
    const results = searchReceipts(query, searchType);
    setSavedReceipts(results);
    setShowReceipts(true);
  };

  const showSection = (section: 'receipts' | 'sellers' | 'report') => {
    setShowReceipts(section === 'receipts');
    setShowSellerManagement(section === 'sellers');
    setShowSalesReport(section === 'report');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {showPrintDialog && lastSavedReceipt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Recibo Salvo com Sucesso!</h3>
              <p className="mb-4">Deseja imprimir o recibo agora?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowPrintDialog(false);
                    setLastSavedReceipt(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Não
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Sim, Imprimir
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ReceiptIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Recibo de Vendas</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              <button
                onClick={() => showSection('sellers')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <List className="w-4 h-4" />
                Vendedores
              </button>
              <button
                onClick={() => showSection('receipts')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <List className="w-4 h-4" />
                Recibos
              </button>
              <button
                onClick={() => showSection('report')}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Relatório
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendedor(a)</label>
              <select
                value={selectedSeller?.id || ''}
                onChange={(e) => {
                  const seller = sellers.find(s => s.id === e.target.value);
                  setSelectedSeller(seller || null);
                  if (seller) {
                    const nextNumber = getNextAvailableNumber(seller.id!);
                    setReceiptNumber(nextNumber || seller.startRange);
                  } else {
                    setReceiptNumber(0);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um vendedor</option>
                {sellers.filter(s => s.active).map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name} ({String(seller.startRange).padStart(4, '0')}-{String(seller.endRange).padStart(4, '0')})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nº do Talão</label>
              <input
                type="number"
                value={receiptNumber || ''}
                onChange={(e) => setReceiptNumber(parseInt(e.target.value))}
                min={selectedSeller?.startRange || 0}
                max={selectedSeller?.endRange || 9999}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 rounded-t-lg border-b border-gray-200 p-4 grid grid-cols-12 gap-4 font-medium text-gray-700">
              <div className="col-span-1">Ordem</div>
              <div className="col-span-5">Descrição</div>
              <div className="col-span-2">Quantidade</div>
              <div className="col-span-2">Preço unitário</div>
              <div className="col-span-2">Total</div>
            </div>

            {products.map((product, index) => (
              <ProductRow
                key={index}
                product={product}
                index={index}
                updateProduct={updateProduct}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            {products.length < 5 && (
              <button
                onClick={addProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Adicionar produto
              </button>
            )}
            <div className="text-right">
              <p className="text-sm text-gray-600">Total:</p>
              <p className="text-2xl font-bold text-blue-600">R$ {totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="hidden">
          <PrintableReceipt
            ref={printableRef}
            receipt={lastSavedReceipt || {
              receiptNumber,
              date,
              seller: selectedSeller?.name || '',
              products,
              totalAmount,
            }}
          />
        </div>

        {showSellerManagement && <SellerManagement onSellerUpdate={loadSellers} />}
        {showSalesReport && <SalesReportGenerator sellers={sellers} />}

        {showReceipts && (
          <>
            <SearchReceipts
              onSearch={handleSearch}
              onSearchTypeChange={setSearchType}
            />
            <ReceiptList receipts={savedReceipts} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;