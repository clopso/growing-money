import React, { useState, useCallback, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Calendar,
  Percent,
  BarChart3,
  ListOrdered,
} from "lucide-react";

// --- Interfaces for component props and data ---
interface InputData {
  initialAmount: number;
  monthlyContribution: number;
  interestRate: number;
  interestType: "annual" | "monthly";
  duration: number;
  durationType: "years" | "months";
  annualGrowthRate: number;
}

// Interface for the new monthly breakdown table
interface MonthlyDataPoint {
  month: number;
  interestEarned: number;
  totalInvested: number;
  totalInterest: number;
  finalBalance: number;
  monthlyContribution: number;
}

interface CalculationResult {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  chartData: ChartDataPoint[];
  monthlyData: MonthlyDataPoint[]; // Added for the details table
}

interface ChartDataPoint {
  year: number;
  totalInvested: number;
  finalValue: number;
  monthlyContribution: number;
}

// --- Utility Functions ---

// Formats a number into a BRL currency string for display in results.
const formatToBRL = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value).replace(/\s/g, '');;
};

// Formats a raw string of digits into a BRL format for the input field.
const formatBRLInput = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  const number = parseInt(numericValue, 10) / 100;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

// Parses a BRL-formatted string from an input into a number.
const parseBRLInput = (value: string): number => {
  const numericValue = value.replace(/\D/g, "");
  if (numericValue === "") return 0;
  return parseInt(numericValue, 10) / 100;
};

// Sanitizes and formats a string for a percentage input (allows one comma).
const formatPercentInput = (value: string): string => {
  let sanitized = value.replace(/[^0-9,]/g, "");
  const parts = sanitized.split(",");
  if (parts.length > 2) {
    sanitized = parts[0] + "," + parts.slice(1).join("");
  }
  return sanitized;
};

// Parses a percentage string (with a comma) into a number.
const parsePercentInput = (value: string): number => {
  const parsed = parseFloat(value.replace(",", "."));
  return isNaN(parsed) ? 0 : parsed;
};

// --- Core Calculation Logic ---
const calculateCompoundInterest = (data: InputData): CalculationResult => {
  const {
    initialAmount,
    monthlyContribution,
    interestRate,
    interestType,
    duration,
    durationType,
    annualGrowthRate,
  } = data;

  const totalMonths = durationType === "years" ? duration * 12 : duration;
  const monthlyRate =
    interestType === "annual"
      ? Math.pow(1 + interestRate / 100, 1 / 12) - 1
      : interestRate / 100;
  const annualGrowthDecimal = annualGrowthRate / 100;

  let balance = initialAmount;
  let totalInvested = initialAmount;
  let currentMonthlyContribution = monthlyContribution;
  let totalInterestEarned = 0;

  const chartData: ChartDataPoint[] = [];
  const monthlyData: MonthlyDataPoint[] = []; // Array for the detailed table

  chartData.push({
    year: 0,
    totalInvested: initialAmount,
    finalValue: initialAmount,
    monthlyContribution: monthlyContribution,
  });

  for (let month = 1; month <= totalMonths; month++) {
    const interestThisMonth = balance * monthlyRate;
    totalInterestEarned += interestThisMonth;
    balance += interestThisMonth;

    balance += currentMonthlyContribution;
    totalInvested += currentMonthlyContribution;

    monthlyData.push({
      month,
      interestEarned: interestThisMonth,
      totalInvested,
      totalInterest: totalInterestEarned,
      finalBalance: balance,
      monthlyContribution: currentMonthlyContribution,
    });

    if (month % 12 === 0) {
      currentMonthlyContribution *= 1 + annualGrowthDecimal;
      chartData.push({
        year: month / 12,
        totalInvested,
        finalValue: balance,
        monthlyContribution: currentMonthlyContribution,
      });
    }
  }

  if (totalMonths % 12 !== 0) {
    chartData.push({
      year: parseFloat((totalMonths / 12).toFixed(2)),
      totalInvested,
      finalValue: balance,
      monthlyContribution: currentMonthlyContribution,
    });
  }

  return {
    finalAmount: balance,
    totalInvested,
    totalInterest: balance - totalInvested,
    chartData,
    monthlyData, // Return the detailed monthly data
  };
};

// --- Input Form Component ---
const InputForm: React.FC<{
  data: InputData;
  onChange: (data: InputData) => void;
  onCalculate: () => void;
  onClear: () => void;
}> = ({ data, onChange, onCalculate, onClear }) => {
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
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-1" /> Período
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={displayValues.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="10"
            />
            <select
              value={data.durationType}
              onChange={(e) =>
                handleSelectChange("durationType", e.target.value)
              }
              className="px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="years">Anos</option>
              <option value="months">Meses</option>
            </select>
          </div>
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

// --- Results Panel Component ---
const ResultsPanel: React.FC<{ result: CalculationResult }> = ({ result }) => {
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

// --- Chart Component ---
const ChartComponent: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  const formatTooltip = (value: number, name: string) => [
    formatToBRL(value),
    name === "Total investido" ? "Total investido" : "Valor final",
  ];
  const formatXAxisLabel = (value: number) => `Ano ${value}`;
  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return formatToBRL(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Crescimento do investimento ao longo do tempo
      </h3>
      <div className="h-64 sm:h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="year"
              tickFormatter={formatXAxisLabel}
              stroke="#666"
              padding={{ left: 20, right: 20 }}
            />
            <YAxis tickFormatter={formatYAxisTick} stroke="#666" width={80} />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(value) => `Ano ${value}`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              type="monotone"
              dataKey="totalInvested"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Total investido"
            />
            <Line
              type="monotone"
              dataKey="finalValue"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Valor final"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- New Details Table Component ---
const DetailsTable: React.FC<{ data: MonthlyDataPoint[] }> = ({ data }) => {
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
                  {formatToBRL(row.totalInvested)}{" "}
                  <span className="text-xs text-gray-400">
                  (+{formatToBRL(row.monthlyContribution)})
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

// --- Main App Component ---
const CompoundInterestCalculator = () => {
  const defaultValues: InputData = {
    initialAmount: 6000,
    monthlyContribution: 1300,
    interestRate: 15,
    interestType: "annual",
    duration: 10,
    durationType: "years",
    annualGrowthRate: 6.5,
  };

  const [inputData, setInputData] = useState<InputData>(defaultValues);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = useCallback(() => {
    if (
      (inputData.durationType === "years" && inputData.duration < 1) ||
      (inputData.durationType === "months" && inputData.duration < 1)
    ) {
      console.error("Duration must be at least 1.");
      return;
    }
    const calculationResult = calculateCompoundInterest(inputData);
    setResult(calculationResult);
  }, [inputData]);

  const handleClear = useCallback(() => {
    setInputData({
      initialAmount: 0,
      monthlyContribution: 0,
      interestRate: 0,
      interestType: "annual",
      duration: 1,
      durationType: "years",
      annualGrowthRate: 0,
    });
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-2 sm:p-4 lg:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 lg:mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Calculadora de Juros Compostos
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">
            Simule o crescimento do seu investimento com contribuições mensais
            crescentes
          </p>
        </header>

        <main>
          <InputForm
            data={inputData}
            onChange={setInputData}
            onCalculate={handleCalculate}
            onClear={handleClear}
          />

          {result && (
            <div className="mt-6 lg:mt-8 space-y-6 lg:space-y-8">
              <ResultsPanel result={result} />
              <ChartComponent data={result.chartData} />
              <DetailsTable data={result.monthlyData} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
