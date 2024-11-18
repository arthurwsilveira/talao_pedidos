import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Receipt } from '../types';

interface SearchReceiptsProps {
  onSearch: (results: Receipt[]) => void;
  onSearchTypeChange: (type: 'number' | 'date') => void;
}

export default function SearchReceipts({ onSearch, onSearchTypeChange }: SearchReceiptsProps) {
  const [searchType, setSearchType] = useState<'number' | 'date'>('number');

  const handleSearchTypeChange = (type: 'number' | 'date') => {
    setSearchType(type);
    onSearchTypeChange(type);
  };

  return (
    <div className="flex gap-4 items-center mb-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Buscar por:</label>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchType}
          onChange={(e) => handleSearchTypeChange(e.target.value as 'number' | 'date')}
        >
          <option value="number">Número do Recibo</option>
          <option value="date">Data</option>
        </select>
      </div>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type={searchType === 'date' ? 'date' : 'text'}
          placeholder={searchType === 'number' ? 'Digite o número do recibo...' : ''}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}