import React from "react";
import {
  calculateEMA,
  calculateSMA,
  calculateRSI, 
  calculateKernelRegression,
  defaultEMAParams,
  defaultSMAParams,
  defaultRSIParams,
  defaultKRParams
} from "./momentum";
import { TbMathIntegrals } from "react-icons/tb";

export interface IndicatorParameterType {
  // Nested array because some functions tend to return multiple series
  func: (data: number[], params: any) => number[][];
  params: { [param: string]: any };
  name: string;
  shortName: string;
  tag: string;
  icon: React.ReactElement;
  chartType: "inchart" | "subchart"
}

interface IndicatorParametersType {
  [shortId: string]: IndicatorParameterType;
}

export const IndicatorParameters: IndicatorParametersType = {
  ema: {
    func: calculateEMA,
    params: defaultEMAParams,
    name: "Exponential Moving Average",
    shortName: "EMA",
    tag: "Momentum",
    icon: <TbMathIntegrals />,
    chartType: "inchart",
  },
  sma: {
    func: calculateSMA,
    params: defaultSMAParams,
    name: "Simple Moving Average",
    shortName: "SMA",
    tag: "Momentum",
    icon: <TbMathIntegrals />,
    chartType: "inchart",
  },
  rsi: {
    func: calculateRSI,
    params: defaultRSIParams,
    name: "Relative Strength Indicator",
    shortName: "RSI",
    tag: "Momentum",
    icon: <TbMathIntegrals />,
    chartType: "subchart",
  },
  kr: {
    func: calculateKernelRegression,
    params: defaultKRParams,
    name: "Kernel Regression",
    shortName: "KR",
    tag: "Momentum",
    icon: <TbMathIntegrals />,
    chartType: "inchart",
  }
};
