import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './types/response';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ){}

  async login (body: LoginDto): Promise<LoginResponse> {
    let { username, password } = body;

    const user = await this.userService._getUserByWhereCondition({
      username
    });

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new BadRequestException('Contraseña incorrecta', {
        description: 'La contraseña ingresada es incorrecta',
      });
    }

    const token = await this._generateToken(user.id, user.username);

    return {
      token,
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
    };
  }

  async _generateToken(userId: string, username: string) {
    const payload = { id: userId, username };
    return this.jwtService.sign(payload);
  }
}
