import React from 'react';
import { Product } from '../types';

interface ProductRowProps {
  product: Product;
  index: number;
  updateProduct: (index: number, field: keyof Product, value: string | number) => void;
}

export default function ProductRow({ product, index, updateProduct }: ProductRowProps) {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200">
      <div className="col-span-1">
        <input
          type="text"
          value={product.order}
          onChange={(e) => updateProduct(index, 'order', e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="col-span-5">
        <input
          type="text"
          value={product.description}
          onChange={(e) => updateProduct(index, 'description', e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={product.quantity || ''}
          onChange={(e) => updateProduct(index, 'quantity', Number(e.target.value))}
          className="w-full px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={product.unitPrice || ''}
          onChange={(e) => updateProduct(index, 'unitPrice', Number(e.target.value))}
          className="w-full px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="col-span-2">
        <div className="px-2 py-1 bg-gray-50 rounded-md font-medium">
          R$ {product.total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}