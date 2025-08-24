import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WsgatewayService } from '../services/wsgateway.service';
import { CreateWsgatewayDto } from '../dto/create-wsgateway.dto';
import { UpdateWsgatewayDto } from '../dto/update-wsgateway.dto';


@Controller('wsgateway')
export class WsgatewayController {
  constructor(private readonly wsgatewayService: WsgatewayService) {}

  @Post()
  create(@Body() createWsgatewayDto: CreateWsgatewayDto) {
    return this.wsgatewayService.create(createWsgatewayDto);
  }

  @Get()
  findAll() {
    return this.wsgatewayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wsgatewayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWsgatewayDto: UpdateWsgatewayDto) {
    return this.wsgatewayService.update(+id, updateWsgatewayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wsgatewayService.remove(+id);
  }
}
