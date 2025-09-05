// src/types/types.ts

export interface InputData {
  initialAmount: number;
  monthlyContribution: number;
  interestRate: number;
  interestType: 'annual' | 'monthly';
  duration: number;
  durationType: 'years' | 'months';
  annualGrowthRate: number;
}

export interface MonthlyDataPoint {
  month: number;
  initialBalance: number;
  contributionAmount: number;
  interestEarned: number;
  finalBalance: number;
  totalContributed: number;
  totalInterest: number;
}

// Este tipo precisa ser flexível para aceitar anos ou meses
export interface ChartDataPoint {
  year?: number;
  month?: number;
  totalInvested: number;
  finalValue: number;
}

export interface CalculationResult {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  monthlyData: MonthlyDataPoint[];
  chartData: ChartDataPoint[];
}