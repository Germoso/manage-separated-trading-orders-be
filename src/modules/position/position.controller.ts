import { Body, Controller, Delete, Get, Post, Query, Req } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { ClosePositionResponse, CreatePositionResponse, DeletePositionResponse, FindAllPositionsResponse } from './types/response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllPositionsDto } from './dto/find-all-positions.dto';

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
  async findAllPositions (@Req() req, @Query() dto: FindAllPositionsDto): Promise<FindAllPositionsResponse> {
    const positions = await this.positionService.findAllPositions(req.user.id, dto);
    return positions;
  }

  @Post('')
  async createPosition (@Body() data: CreatePositionDto): Promise<CreatePositionResponse> {
    const position = await this.positionService.createPosition(data);
    return position;
  }
}
