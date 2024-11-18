import React, { useState, useEffect } from 'react';
import { UserPlus, Users, AlertCircle, Trash2, Edit } from 'lucide-react';
import { Seller } from '../types';
import { createSeller, getSellers, isRangeAvailable, updateSeller, deleteSeller } from '../utils/sellerStorage';

interface SellerManagementProps {
  onSellerUpdate?: () => void;
}

const initialSellerState = {
  name: '',
  startRange: 1,
  endRange: 50,
  active: true,
  commission: 5
};

export default function SellerManagement({ onSellerUpdate }: SellerManagementProps) {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [newSeller, setNewSeller] = useState(initialSellerState);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = () => {
    const loadedSellers = getSellers();
    setSellers(loadedSellers);
  };

  const validateRange = (start: number, end: number): boolean => {
    if (start >= end) {
      setError('O início do intervalo deve ser menor que o fim');
      return false;
    }
    if (end - start > 50) {
      setError('O intervalo máximo permitido é de 50 números');
      return false;
    }
    if (!isRangeAvailable(start, end, editingSeller?.id)) {
      setError('Este intervalo de números já está em uso');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newSeller.name.trim()) {
      setError('Nome do vendedor é obrigatório');
      return;
    }

    if (!validateRange(newSeller.startRange, newSeller.endRange)) {
      return;
    }

    try {
      if (editingSeller) {
        updateSeller({ ...editingSeller, ...newSeller });
      } else {
        createSeller({
          ...newSeller,
          createdAt: new Date().toISOString()
        });
      }
      setShowForm(false);
      setEditingSeller(null);
      setNewSeller(initialSellerState);
      loadSellers();
      if (onSellerUpdate) {
        onSellerUpdate();
      }
    } catch (err) {
      setError('Erro ao salvar vendedor');
    }
  };

  const handleEdit = (seller: Seller) => {
    setEditingSeller(seller);
    setNewSeller({
      name: seller.name,
      startRange: seller.startRange,
      endRange: seller.endRange,
      active: seller.active,
      commission: seller.commission
    });
    setShowForm(true);
  };

  const handleDelete = (sellerId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este vendedor?')) {
      deleteSeller(sellerId);
      loadSellers();
      if (onSellerUpdate) {
        onSellerUpdate();
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingSeller(null);
    setNewSeller(initialSellerState);
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Gerenciamento de Vendedores</h2>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Novo Vendedor
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Vendedor
              </label>
              <input
                type="text"
                value={newSeller.name}
                onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comissão (%)
              </label>
              <input
                type="number"
                value={newSeller.commission}
                onChange={(e) => setNewSeller({ ...newSeller, commission: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Início do Talão
              </label>
              <input
                type="number"
                value={newSeller.startRange}
                onChange={(e) => setNewSeller({ ...newSeller, startRange: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fim do Talão
              </label>
              <input
                type="number"
                value={newSeller.endRange}
                onChange={(e) => setNewSeller({ ...newSeller, endRange: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newSeller.active}
                onChange={(e) => setNewSeller({ ...newSeller, active: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Ativo</span>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingSeller ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4">Vendedor</th>
              <th className="text-center py-3 px-4">Faixa de Numeração</th>
              <th className="text-center py-3 px-4">Comissão</th>
              <th className="text-center py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-b border-gray-100">
                <td className="py-3 px-4">{seller.name}</td>
                <td className="text-center py-3 px-4">
                  {String(seller.startRange).padStart(4, '0')} - {String(seller.endRange).padStart(4, '0')}
                </td>
                <td className="text-center py-3 px-4">{seller.commission}%</td>
                <td className="text-center py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    seller.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {seller.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="text-right py-3 px-4">
                  <button
                    onClick={() => handleEdit(seller)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(seller.id!)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}