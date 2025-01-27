export const IntervalMapping: { [K in IntervalTypes]: number } = {
  "1 secs": 1,
  "5 secs": 5,
  "10 secs": 10,
  "15 secs": 15,
  "30 secs": 30,
  "1 min": 60,
  "2 mins": 120,
  "3 mins": 180,
  "5 mins": 300,
  "10 mins": 600,
  "15 mins": 900,
  "20 mins": 1200,
  "30 mins": 1800,
  "1 hour": 3600,
  "2 hours": 7200,
  "3 hours": 10800,
  "4 hours": 14400,
  "8 hours": 28800,
  "1 day": 86400,
  "1 week": 604800,
  "1 month": 2592000, // Assuming 30 days
} as const;


export type IntervalTypes =
  | "1 secs"
  | "5 secs"
  | "10 secs"
  | "15 secs"
  | "30 secs"
  | "1 min"
  | "2 mins"
  | "3 mins"
  | "5 mins"
  | "10 mins"
  | "15 mins"
  | "20 mins"
  | "30 mins"
  | "1 hour"
  | "2 hours"
  | "3 hours"
  | "4 hours"
  | "8 hours"
  | "1 day"
  | "1 week"
  | "1 month";
export type DurationTypes =
  | "1 D"
  | "2 D"
  | "5 D"
  | "1 M"
  | "3 M"
  | "6 M"
  | "1 Y"
  | "5 Y"
  | "10 Y";
export interface TickerHistoricalParams {
  duration?: DurationTypes;
  interval?: IntervalTypes;
  price_type?:
    | "TRADES"
    | "MIDPOINT"
    | "BID"
    | "ASK"
    | "BID_ASK"
    | "ADJUSTED_LAST"
    | "HISTORICAL_VOLATILITY"
    | "OPTION_IMPLIED_VOLATILITY"
    | "REBATE_RATE"
    | "FEE_RATE"
    | "YIELD_BID"
    | "YIELD_ASK"
    | "YIELD_BID_ASK"
    | "YIELD_LAST";
}

export interface OHLC {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  [key: string]: any;
}

export interface TimeSeries {
  date: Date;
  value: number;
}

export type Data = OHLC[] | TimeSeries[];

export interface HistoricalData extends OHLC {
  average: number;
  barCount: number;
  volume: number;
}
