import { Body, Controller, Get, Post } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { CreateTickerDto } from './dto/create-ticker.dto';
import { CreateTickerResponse } from './types/response';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/modules/auth/public.decorator';
import { Cron, CronExpression } from '@nestjs/schedule';

@ApiTags('Ticker')
@Controller('ticker')
export class TickerController {
  constructor(private readonly tickerService: TickerService) { }

  @Public()
  @Post()
  async createTicker(@Body() dto: CreateTickerDto): Promise<CreateTickerResponse> {
    return await this.tickerService.createTicker(dto);
  }

  @Public()
  @Get()
  async findAllTickers(): Promise<CreateTickerResponse[]> {
    return await this.tickerService.findAllTickers();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.tickerService._updateAllRealTimeTickerPrice();
    console.log('Cron job is running...');
  }
}
