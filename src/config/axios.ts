import axios from 'axios';

export const binanceAxiosInstance = axios.create({
  baseURL: 'https://api.binance.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
