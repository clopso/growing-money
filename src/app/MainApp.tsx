import { useState, useCallback } from "react";

import type { InputData, CalculationResult } from "../types/types";

import { calculateCompoundInterest } from "../utils/calculation";
import { InputForm } from "../components/InputForm";
import { ResultsPanel } from "../components/ResultsPanel";
import { ChartComponent } from "../components/ChartComponent";
import { DetailsTable } from "../components/DetailsTable";
import ProjectInfo from "../components/ProjectInfo";
import HowToUse from "../components/HowToUse";
import LearnMore from "../LearnMore";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";

const CompoundInterestCalculator = () => {
  const defaultValues: InputData = {
    initialAmount: 10000,
    monthlyContribution: 1000,
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
        <Navbar />
        <PageHeader
          title="Calculadora de Juros Compostos"
          subtitle="Simule o crescimento do seu investimento com contribuições mensais crescentes"
        />

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

        <footer className="mt-8 lg:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <HowToUse />
            <ProjectInfo />
          </div>

          <div className="mt-8 lg:mt-12">
            <LearnMore />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
