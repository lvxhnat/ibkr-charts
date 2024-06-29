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
