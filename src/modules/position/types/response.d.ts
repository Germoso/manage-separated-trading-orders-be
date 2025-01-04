export interface CreatePositionResponse {
  id: string;
  price: number;
  quantity: number;
  account: {
    id: string;
  };
  ticker: {
    id: string;
    symbol: string;
  };
}

export type FindAllPositionsResponse = Array<{
  id: string;
  price: number;
  quantity: number;
  account: {
    id: string;
  };
  ticker: {
    id: string;
    symbol: string;
    price: number;
  };
}>

export interface DeletePositionResponse {
  id: string;
}

export interface ClosePositionResponse {
  id: string;
  price: number;
}