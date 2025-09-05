import React, { useState, useCallback, useEffect } from "react";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Calendar,
  Percent,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import type { InputData } from "../../types/types";
import {
  formatBRLInput,
  parseBRLInput,
  formatPercentInput,
  parsePercentInput,
} from "../../utils/utils";

interface InputFormProps {
  data: InputData;
  onChange: (data: InputData) => void;
  onCalculate: () => void;
  onClear: () => void;
}

// --- Input Form Component ---
export const InputForm: React.FC<InputFormProps> = ({
  data,
  onChange,
  onCalculate,
  onClear,
}) => {
  const [displayValues, setDisplayValues] = useState({
    initialAmount: formatBRLInput(
      data.initialAmount.toFixed(2).replace(".", "")
    ),
    monthlyContribution: formatBRLInput(
      data.monthlyContribution.toFixed(2).replace(".", "")
    ),
    // Corrigido para usar vírgula na inicialização
    interestRate: data.interestRate.toString().replace(".", ","),
    duration: data.duration.toString(),
    // Corrigido para usar vírgula na inicialização
    annualGrowthRate: data.annualGrowthRate.toString().replace(".", ","),
  });

  const [errors, setErrors] = useState<{ duration?: string }>({});

  useEffect(() => {
    // Sincroniza o valor de juros
    if (parsePercentInput(displayValues.interestRate) !== data.interestRate) {
      setDisplayValues((prev) => ({
        ...prev,
        interestRate: data.interestRate.toString().replace(".", ","),
      }));
    }

    // Sincroniza o valor de crescimento anual
    if (
      parsePercentInput(displayValues.annualGrowthRate) !==
      data.annualGrowthRate
    ) {
      setDisplayValues((prev) => ({
        ...prev,
        annualGrowthRate: data.annualGrowthRate.toString().replace(".", ","),
      }));
    }

    // Sincroniza os outros campos (para o botão "Limpar" funcionar)
    if (parseBRLInput(displayValues.initialAmount) !== data.initialAmount) {
      setDisplayValues((prev) => ({
        ...prev,
        initialAmount: formatBRLInput(
          data.initialAmount.toFixed(2).replace(".", "")
        ),
      }));
    }
    if (
      parseBRLInput(displayValues.monthlyContribution) !==
      data.monthlyContribution
    ) {
      setDisplayValues((prev) => ({
        ...prev,
        monthlyContribution: formatBRLInput(
          data.monthlyContribution.toFixed(2).replace(".", "")
        ),
      }));
    }
    if (displayValues.duration !== data.duration.toString()) {
      setDisplayValues((prev) => ({
        ...prev,
        duration: data.duration.toString(),
      }));
    }
  }, [data]);

  const handleInputChange = (field: keyof InputData, value: string) => {
    let newDisplayValue = value;
    let newNumericValue: number;

    switch (field) {
      case "initialAmount":
      case "monthlyContribution":
        newDisplayValue = formatBRLInput(value);
        newNumericValue = parseBRLInput(newDisplayValue);
        break;
      case "interestRate":
      case "annualGrowthRate":
        newDisplayValue = formatPercentInput(value);
        newNumericValue = parsePercentInput(newDisplayValue);
        break;
      case "duration":
        newDisplayValue = value.replace(/\D/g, "");
        newNumericValue = newDisplayValue ? parseInt(newDisplayValue, 10) : 0;

        if (newNumericValue < 1 && newDisplayValue !== "") {
          setErrors((prev) => ({
            ...prev,
            duration: "O período deve ser no mínimo 1.",
          }));
        } else {
          // Limpa o erro se o valor for válido
          setErrors((prev) => ({ ...prev, duration: undefined }));
        }

        break;
      default:
        return;
    }

    setDisplayValues((prev) => ({ ...prev, [field]: newDisplayValue }));
    onChange({ ...data, [field]: newNumericValue });
  };

  const handleSelectChange = useCallback(
    (field: keyof InputData, value: string) => {
      onChange({ ...data, [field]: value as any });
    },
    [data, onChange]
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Parâmetros do Investimento
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Initial Amount */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <DollarSign className="w-4 h-4 mr-1" /> Valor Inicial
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
              R$
            </span>
            <input
              type="text"
              value={displayValues.initialAmount}
              onChange={(e) =>
                handleInputChange("initialAmount", e.target.value)
              }
              className="w-full pl-12 pr-3 sm:px-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right"
              placeholder="0,00"
            />
          </div>
        </div>

        {/* Monthly Contribution */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <TrendingUp className="w-4 h-4 mr-1" /> Aporte Mensal
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
              R$
            </span>
            <input
              type="text"
              value={displayValues.monthlyContribution}
              onChange={(e) =>
                handleInputChange("monthlyContribution", e.target.value)
              }
              className="w-full pl-12 pr-3 sm:px-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right"
              placeholder="0,00"
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Percent className="w-4 h-4 mr-1" /> Taxa de Juros
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={displayValues.interestRate}
              onChange={(e) =>
                handleInputChange("interestRate", e.target.value)
              }
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="15"
            />
            <select
              value={data.interestType}
              onChange={(e) =>
                handleSelectChange("interestType", e.target.value)
              }
              className="px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="annual">Anual</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>
        </div>

        {/* Duration */}
       <div className="space-y-1"> {/* Mudei space-y-2 para space-y-1 para acomodar a msg */}
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-1" /> Período
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={displayValues.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              // Aplica classes condicionalmente
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg transition-all
                ${
                  errors.duration
                    ? "border-red-500 text-red-700 focus:ring-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }
              `}
              placeholder="10"
            />
            <select
              value={data.durationType}
              onChange={(e) =>
                handleSelectChange("durationType", e.target.value)
              }
              className={`px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg transition-all
                ${
                  errors.duration
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }
              `}
            >
              <option value="years">Anos</option>
              <option value="months">Meses</option>
            </select>
          </div>
          {/* Exibe a mensagem de erro se ela existir */}
          {errors.duration && (
            <div className="flex items-center text-xs text-red-600 pt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {errors.duration}
            </div>
          )}
        </div>

        {/* Annual Growth Rate */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <BarChart3 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">
              Crescimento Anual do Aporte
            </span>
            <span className="sm:hidden">Cresc. Anual</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={displayValues.annualGrowthRate}
              onChange={(e) =>
                handleInputChange("annualGrowthRate", e.target.value)
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-8 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="6,5"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 flex flex-col justify-end sm:col-span-2 xl:col-span-1">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onCalculate}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105"
            >
              Calcular
            </button>
            <button
              onClick={onClear}
              className="flex-1 bg-gray-100 text-gray-700 py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
            >
              Limpar
            </button>
          </div>
          <button
            disabled
            className="w-full bg-gray-50 text-gray-400 py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base cursor-not-allowed border border-gray-200"
          >
            <span className="hidden sm:inline">
              Simular Resgates (Em breve)
            </span>
            <span className="sm:hidden">Resgates (Em breve)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
