import request from "../../../services";

export interface Ticker {
  conid: number;
  country: string;
  currency: string;
  description: string;
  localSymbol: string;
  symbol: string;
  type: string;
}

const searchTicker = (query: string, fixedQuery: string) =>
  request().post<Ticker[]>(`search/${query}`, { fixed_query: fixedQuery });

export default searchTicker;
