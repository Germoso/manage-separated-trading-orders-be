export interface CreateTickerResponse {
  id: string;
  symbol: string;
}

export type FindAllTickersResponse = Array<{
  id: string;
  symbol: string;
  price: number;
}>;

export type UpdateTickerResponse = {
  id: string;
  symbol: string;
  price: number;
}