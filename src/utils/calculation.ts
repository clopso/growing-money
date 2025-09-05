import type { InputData, CalculationResult, MonthlyDataPoint, ChartDataPoint } from '../types/types';

export const calculateCompoundInterest = (data: InputData): CalculationResult => {
  const {
    initialAmount,
    monthlyContribution,
    interestRate,
    interestType,
    duration,
    durationType,
    annualGrowthRate,
  } = data;

  // 1. Conversão de Taxa e Duração
  const monthlyInterestRate = interestType === 'annual'
    ? Math.pow(1 + interestRate / 100, 1 / 12) - 1
    : interestRate / 100;

  const totalMonths = durationType === 'years' ? duration * 12 : duration;
  const annualGrowthFactor = 1 + annualGrowthRate / 100;

  // 2. Loop de Cálculo Mensal
  let currentBalance = initialAmount;
  let currentMonthlyContribution = monthlyContribution;
  let totalContributed = initialAmount;
  let totalInterest = 0
  const monthlyData: MonthlyDataPoint[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    const initialBalanceForMonth = currentBalance;

    // Aumenta o aporte no início de cada novo ano (após o primeiro)
    if (month > 1 && (month - 1) % 12 === 0) {
      currentMonthlyContribution *= annualGrowthFactor;
    }
    
    const interestEarned = currentBalance * monthlyInterestRate;
    currentBalance += interestEarned;
    totalInterest += interestEarned

    monthlyData.push({
      month,
      initialBalance: initialBalanceForMonth,
      contributionAmount: currentMonthlyContribution,
      interestEarned,
      finalBalance: currentBalance,
      totalContributed,
      totalInterest
    });

    currentBalance += currentMonthlyContribution;
    totalContributed += currentMonthlyContribution;
  }

  // 3. Geração dos Dados para o Gráfico (Lógica Condicional)
  let finalChartData: ChartDataPoint[] = [];
  const isOneYearOrLess = totalMonths <= 36;

  if (isOneYearOrLess) {
    // Visão Mensal
    const monthlyPoints = monthlyData.map(entry => ({
      month: entry.month,
      totalInvested: entry.totalContributed,
      finalValue: entry.finalBalance,
    }));
    finalChartData = [...monthlyPoints];
  } else {
    // Visão Anual
    const yearlySummary = monthlyData.reduce<Record<number, ChartDataPoint>>((acc, entry) => {
      const year = Math.ceil(entry.month / 12);
      acc[year] = {
        year,
        totalInvested: entry.totalContributed,
        finalValue: entry.finalBalance,
      };
      return acc;
    }, {});
    const yearlyPoints = Object.values(yearlySummary);
    const startingPoint = { year: 0, totalInvested: initialAmount, finalValue: initialAmount };
    finalChartData = [startingPoint, ...yearlyPoints];
  }
  
  // 4. Resultados Finais
  const finalAmount = currentBalance;

  return {
    finalAmount,
    totalInvested: totalContributed,
    totalInterest,
    monthlyData,
    chartData: finalChartData,
  };
};