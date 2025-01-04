import { Module } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { TickerController } from './ticker.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { BinanceModule } from '../binance/binance.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, BinanceModule, ScheduleModule.forRoot()],
  controllers: [TickerController],
  providers: [TickerService],
  exports: [TickerService]
})
export class TickerModule {}
