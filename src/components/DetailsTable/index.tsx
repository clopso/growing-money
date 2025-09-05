import React from 'react';
import { ListOrdered } from "lucide-react";
import type { MonthlyDataPoint } from '../../types/types';
import { formatToBRL } from '../../utils/utils';

interface DetailsTableProps {
  data: MonthlyDataPoint[];
}

// --- New Details Table Component ---
export const DetailsTable: React.FC<DetailsTableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <ListOrdered className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
          Repartição Mensal
        </h3>
      </div>
      <div className="max-h-[600px] overflow-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-800 uppercase bg-gray-100 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3">
                Mês
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Dinheiro Investido
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Juros
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Acumulado
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Juros Totais
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.month}
                className="bg-white border-b odd:bg-white even:bg-gray-50 hover:bg-blue-50"
              >
                <th
                  scope="row"
                  className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
                >
                  {row.month}
                </th>
                <td className="px-4 py-3 text-right">
                  {formatToBRL(row.totalContributed)}{" "}
                  <span className="text-xs text-gray-400">
                    (+{formatToBRL(row.contributionAmount)})
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-green-600">
                  + {formatToBRL(row.interestEarned)}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatToBRL(row.finalBalance)}
                </td>
                <td className="px-4 py-3 text-right text-purple-600">
                  {formatToBRL(row.totalInterest)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};