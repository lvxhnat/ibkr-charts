import React from "react";
import {
  calculateEMA,
  calculateSMA,
  defaultEMAParams,
  defaultSMAParams,
} from "./momentum/movingAverages";
import { calculateRSI, defaultRSIParams } from "./momentum/relativeStrength";
import { TbMathIntegrals } from "react-icons/tb";

export interface IndicatorParameterType {
  // Nested array because some functions tend to return multiple series
  func: (data: number[], params: any) => number[][];
  params: { [param: string]: any };
  name: string;
  shortName: string;
  tag: string;
  icon: React.ReactElement;
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
  },
  sma: {
    func: calculateSMA,
    params: defaultSMAParams,
    name: "Simple Moving Average",
    shortName: "SMA",
    tag: "Momentum",
    icon: <TbMathIntegrals />,
  },
  rsi: {
    func: calculateRSI,
    params: defaultRSIParams,
    name: "Relative Strength Indicator",
    shortName: "RSI",
    tag: "Momentum",
    icon: <TbMathIntegrals />,
  },
};
