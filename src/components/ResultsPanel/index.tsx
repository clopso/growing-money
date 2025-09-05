import React from 'react';
import type { CalculationResult } from '../../types/types';
import { formatToBRL } from '../../utils/utils';

interface ResultsPanelProps {
  result: CalculationResult;
}

// --- Results Panel Component ---
export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Resultados de Investimentos
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 rounded-lg border-l-4 border-green-500">
          <h4 className="text-xs sm:text-sm font-medium text-green-700 mb-1">
            Valor total final
          </h4>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 break-words">
            {formatToBRL(result.finalAmount)}
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg border-l-4 border-blue-500">
          <h4 className="text-xs sm:text-sm font-medium text-blue-700 mb-1">
            Valor total investido
          </h4>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-800 break-words">
            {formatToBRL(result.totalInvested)}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 sm:p-6 rounded-lg border-l-4 border-purple-500">
          <h4 className="text-xs sm:text-sm font-medium text-purple-700 mb-1">
            Juros totais
          </h4>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-800 break-words">
            {formatToBRL(result.totalInterest)}
          </p>
        </div>
      </div>
    </div>
  );
};