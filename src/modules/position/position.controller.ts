import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { ClosePositionResponse, CreatePositionResponse, DeletePositionResponse, FindAllPositionsResponse } from './types/response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Position')
@Controller('position')
@ApiBearerAuth()
export class PositionController {
  constructor(private readonly positionService: PositionService) { }

  @Post('close/:id')
  async closePosition (@Req() req): Promise<ClosePositionResponse> {
    const position = await this.positionService.closePosition(req.params.id);
    return position;
  }

  @Delete(':id')
  async deletePosition (@Req() req): Promise<DeletePositionResponse> {
    return await this.positionService.deletePosition(req.params.id);
  }

  @Get('')
  async findAllPositions (@Req() req): Promise<FindAllPositionsResponse> {
    const positions = await this.positionService.findAllPositions(req.user.id);
    return positions;
  }

  @Post('')
  async createPosition (@Body() data: CreatePositionDto): Promise<CreatePositionResponse> {
    const position = await this.positionService.createPosition(data);
    return position;
  }
}
