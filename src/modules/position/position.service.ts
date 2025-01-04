import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { AccountService } from '../account/account.service';
import { TickerService } from '../ticker/ticker.service';
import { ClosePositionResponse, CreatePositionResponse, DeletePositionResponse, FindAllPositionsResponse } from './types/response';
import { GeneralStatus, PositionStatus, Prisma } from '@prisma/client';
import { FindAllPositionsDto } from './dto/find-all-positions.dto';

@Injectable()
export class PositionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly accountService: AccountService,
    private readonly tickerService: TickerService,
  ) { }

  async createPosition (data: CreatePositionDto): Promise<CreatePositionResponse> {
    const account = await this.accountService._getAccountByWhereCondition({id: data.accountId });
    const ticker = await this.tickerService._getTickerByWhereCondition({id: data.tickerId });

    const position = await this.prismaService.position.create({
      data: {
        price: data.price,
        quantity: data.quantity,
        account: {
          connect: {
            id: account.id
          }
        },
        ticker: {
          connect: {
            id: ticker.id
          }
        }
      }
    })

    return {
      id: position.id,
      account: {
        id: account.id
      },
      price: position.price,
      quantity: position.quantity,
      ticker: {
        id: ticker.id,
        symbol: ticker.symbol
      }
    }
  }

  async findAllPositions (userId: string, query: FindAllPositionsDto): Promise<FindAllPositionsResponse> {
    const where: Prisma.PositionWhereInput = {
      status: GeneralStatus.ACTIVE,
      account: {
        userId
      },
    }

    query.positionStatus && (where.positionStatus = query.positionStatus);

    const positions = await this.prismaService.position.findMany({
      include: {
        account: true,
        ticker: true
      },
      where
    })

    return positions.map(position => ({
      id: position.id,
      account: {
        id: position.account.id
      },
      price: position.price,
      quantity: position.quantity,
      ticker: {
        id: position.ticker.id,
        symbol: position.ticker.symbol,
        price: position.ticker.price
      },
      positionStatus: position.positionStatus,
      status: position.status
    }))
  }

  async closePosition(positionId: string): Promise<ClosePositionResponse> {
    const position = await this._getPositionByWhereCondition({ id: positionId });

    const res = await this.prismaService.position.update({
      where: {
        id: position.id
      },
      data: {
        closedAt: new Date(),
        positionStatus: PositionStatus.CLOSED
      }
    });

    return {
      id: res.id,
      price: res.closePrice
    };
  }

  async deletePosition (positionId: string): Promise<DeletePositionResponse> {
    const position = await this._getPositionByWhereCondition({ id: positionId });

    const res = await this.prismaService.position.update({
      where: {
        id: position.id
      },
      data: {
        deletedAt: new Date(),
        status: GeneralStatus.INACTIVE
      }
    });

    return {
      id: res.id
    }
  }

  async _getPositionByWhereCondition (where: Prisma.PositionWhereInput) {
    const position = await this.prismaService.position.findFirst({
      where: {
        ...where,
        status: GeneralStatus.ACTIVE
      }
    });

    if (!position) {
      throw new Error('Position not found');
    }

    return position;
  }
}

