import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { binanceAxiosInstance } from 'src/config/axios';
import { GETBinanceTickerPrice } from './types/GETBinanceTickerPrice.response';
// const { Spot } = require('@binance/connector')

// const apiKey = ''
// const apiSecret = ''
// const client = new Spot(apiKey, apiSecret)


@Injectable()
export class BinanceService {

  async _seedTradingPairs() {
  }

  async _getTickerPrice(ticker: string) {
    try {
      const response = await binanceAxiosInstance.get<GETBinanceTickerPrice>(`/api/v3/ticker/price?symbol=${ticker}`)
      return response.data
    } catch (error) {
      throw new InternalServerErrorException('Ha ocurrido un error al obtener el precio del ticker en Binance')
    }
  }
}
