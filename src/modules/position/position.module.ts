import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { AccountModule } from '../account/account.module';
import { TickerModule } from '../ticker/ticker.module';

@Module({
  imports: [PrismaModule, AccountModule, TickerModule],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
