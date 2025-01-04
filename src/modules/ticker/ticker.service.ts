import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateTickerDto } from './dto/create-ticker.dto';
import { TickerUniqueFieldsDto } from './dto/user-unique-fields.dto';
import { CreateTickerResponse, FindAllTickersResponse, UpdateTickerResponse } from './types/response';
import { Prisma } from '@prisma/client';
import { BinanceService } from '../binance/binance.service';

@Injectable()
export class TickerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly binanceService: BinanceService,
  ) {}

  async createTicker (dto: CreateTickerDto): Promise<CreateTickerResponse> {
    await this._validateUniqueFields(dto)

    const ticker = await this.prismaService.ticker.create({
      data: {
        symbol: dto.symbol,
      }
    })

    return {
      id: ticker.id,
      symbol: ticker.symbol,
    }
  }

  async findAllTickers(): Promise<FindAllTickersResponse> {
    const tickers = await this.prismaService.ticker.findMany();

    return tickers.map(ticker => ({
      id: ticker.id,
      symbol: ticker.symbol,
      price: ticker.price,
    }));
  }

  async _updateRealTimeTickerPrice (symbol: string): Promise<UpdateTickerResponse> {
    try {
      const response = await this.binanceService._getTickerPrice(symbol)
      const ticker = await this._getTickerByWhereCondition({ symbol })
      await this.prismaService.ticker.update({
        where: {
          id: ticker.id
        },
        data: {
          price: Number(response.price)
        }
      })
    } catch (error) {
      const ticker = await this._getTickerByWhereCondition({ symbol })
      await this.prismaService.ticker.update({
        where: {
          id: ticker.id
        },
        data: {
          price: 0
        }
      })
    }

    const updatedTicker = await this._getTickerByWhereCondition({ symbol })

    return {
      id: updatedTicker.id,
      symbol: updatedTicker.symbol,
      price: updatedTicker.price,
    }
  }

  async _updateAllRealTimeTickerPrice (): Promise<void> {
    const tickers = await this.prismaService.ticker.findMany()

    for (const ticker of tickers) {
      await this._updateRealTimeTickerPrice(ticker.symbol)
    }
  }

  async _validateUniqueFields (dto: TickerUniqueFieldsDto): Promise<void> {
    const ticker = await this.prismaService.ticker.findUnique({
      where: {
        symbol: dto.symbol,
      }
    })

    if (ticker) {
      throw new Error('Ticker already exists')
    }
  }

  async _getTickerByWhereCondition (where: Prisma.TickerWhereInput) {
    const ticker = await this.prismaService.ticker.findFirst({
      where: {
        ...where
      }
    })

    if (!ticker) {
      throw new NotFoundException('Ticker not found')
    }

    return ticker;
  }
}
