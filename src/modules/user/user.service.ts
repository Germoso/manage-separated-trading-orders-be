import { BadRequestException, ConflictException, forwardRef, Injectable, ForwardReference, Inject } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserUniqueFieldsDto } from './dto/user-unique-fields.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserResponse } from './types/response';
import { Prisma } from '@prisma/client';
import { AccountService } from '../account/account.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) {}

  async _validateUniqueFields (data: UserUniqueFieldsDto) {
    const checkUsername = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            username: data.username
          }
        ]
      }
    })

    if (checkUsername) {
      throw new ConflictException('El nombre de usuario ya existe', {
        description: 'El nombre de usuario ya existe'
      })
    }
  }

  async _getUserByWhereCondition (where: Prisma.UserWhereInput) {
    const user = await this.prismaService.user.findFirst({
      where
    })

    if (!user) {
      throw new BadRequestException('Usuario no encontrado', {
        description: 'Usuario no encontrado'
      })
    }

    return user
  }

  async createUser (data: CreateUserDto): Promise<CreateUserResponse> {
    await this._validateUniqueFields(data)

    if (data.password !== data.passwordRepeat) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        username: data.username,
        password: hashedPassword
      }
    })

    await this.accountService.createAccount({
      userId: user.id,
      balance: 0
    })

    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt
    }
  }
}
