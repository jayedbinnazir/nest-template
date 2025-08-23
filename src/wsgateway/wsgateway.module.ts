import { Module } from '@nestjs/common';
import { WsgatewayController } from './controllers/wsgateway.controller';
import { WsgatewayService } from './services/wsgateway.service';
import { Wsgateway } from './gateway';
import { ConsumerService } from './services/consumer.service';


@Module({
  controllers: [WsgatewayController],
  providers: [WsgatewayService , Wsgateway ,  ConsumerService],
})
export class WsgatewayModule {}
