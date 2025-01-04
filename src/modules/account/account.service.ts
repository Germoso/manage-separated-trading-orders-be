import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateAccountResponse } from './types/response';
import { Prisma } from '@prisma/client';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createAccount (dto: CreateAccountDto): Promise<CreateAccountResponse> {
    const user = await this.userService._getUserByWhereCondition({ id: dto.userId });

    const account = await this.prismaService.account.create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        },
        balance: dto.balance
      }
    })

    return {
      id: account.id,
      balance: account.balance,
      user: {
        id: user.id,
        username: user.username,
      }
    }
  }

  async _getAccountByWhereCondition (where: Prisma.AccountWhereInput) {
    const account = await this.prismaService.account.findFirst({
      where,
    });

    if(!account) {
      throw new NotFoundException('Account not found');
    }

    return account
  }
}
