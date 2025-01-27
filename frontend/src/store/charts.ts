import { create } from "zustand";
import { Data } from "../components/Charting/types";
import { IndicatorParameterType } from "../common/indicators";

export interface Components {
  conId: number;
  width: number;
  height: number;
  margin: { t: number; b: number; l: number; r: number };
  minY: number;
  maxY: number;
  extentX: string[];
  extentY: [number, number];
  xScale?: d3.ScaleBand<string>;
  yScale?: d3.ScaleLinear<number, number, never>;
  yScales?: d3.ScaleLinear<number, number, never>[]; // List of temporary y scales
}

export interface IndicatorObject extends IndicatorParameterType {
  color: string;
  data: number[][];
}

export interface Indicators {
  [indicatorId: string]: IndicatorObject;
}

interface ChartSettings {
  comps: Components;
  data: Data;
  mousePosition: [number, number];
  indicators: Indicators;
}

interface ChartsTypes {
  charts: { [id: string]: ChartSettings };
  setData: (id: string, data: Data) => void;
  setIndicators: (id: string, indicator: Indicators) => void;
  removeIndicator: (id: string, indicatorId: string) => void;
  setComponents: (id: string, components: Components) => void;
}

export const emptySettings: ChartSettings = {
  comps: {
    conId: 0,
    margin: { t: 1, b: 1, l: 1, r: 1 },
    width: 1200,
    height: 550,
    minY: 0,
    maxY: 100,
    extentX: [],
    extentY: [0, 100],
  } as Components,
  mousePosition: [0, 0],
  data: [],
  indicators: {} as Indicators,
};

export const useChartStore = create<ChartsTypes>((set) => ({
  charts: {},
  setData: (id: string, data: Data) =>
    set((st) => {
      const pChart = st.charts[id] ?? emptySettings;
      const newChart = { ...st.charts, [id]: { ...pChart, data: data } };
      return {
        charts: newChart,
      };
    }),
  setIndicators: (id: string, indicators: Indicators) =>
    set((state) => {
      const pChart = state.charts[id] ?? emptySettings;
      return { charts: {
        ...state.charts,
        [id]: {
          ...pChart,
          indicators: { ...pChart.indicators, ...indicators },
        },
      }};
    }),
  removeIndicator: (id: string, indicatorId: string) =>
    set((st) => {
      const pChart = st.charts[id];
      const newInds: Indicators = pChart.indicators;
      delete newInds[indicatorId as keyof Indicators];
      const newChart = {
        ...st.charts,
        [id]: { ...pChart, indicators: newInds },
      };
      return { charts: newChart };
    }),
  setComponents: (id: string, comps: Components) =>
    set((st) => {
      const pChart = st.charts[id] ?? emptySettings;
      const newChart = {
        ...st.charts,
        [id]: { ...pChart, comps: { ...pChart.comps, ...comps } },
      };
      return { charts: newChart };
    }),
}));

/** Chart Mouse Position Stores */
interface ChartMouseTypes {
  mousePosition: { [id: string]: [number, number] };
  setMousePosition: (id: string, mousePos: [number, number]) => void;
}

export const useChartMouseStore = create<ChartMouseTypes>((set) => ({
  mousePosition: {},
  setMousePosition: (id: string, mousePos: [number, number]) =>
    set((state) => ({ mousePosition: { ...state.mousePosition, [id]: mousePos } })),
}));
