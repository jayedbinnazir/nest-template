import { Injectable } from '@nestjs/common';
import { CreateWsgatewayDto } from '../dto/create-wsgateway.dto';
import { UpdateWsgatewayDto } from '../dto/update-wsgateway.dto';


@Injectable()
export class WsgatewayService {
  create(createWsgatewayDto: CreateWsgatewayDto) {
    return 'This action adds a new wsgateway';
  }

  findAll() {
    return `This action returns all wsgateway`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wsgateway`;
  }

  update(id: number, updateWsgatewayDto: UpdateWsgatewayDto) {
    return `This action updates a #${id} wsgateway`;
  }

  remove(id: number) {
    return `This action removes a #${id} wsgateway`;
  }
}
