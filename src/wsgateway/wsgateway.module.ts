import { Module } from '@nestjs/common';
import { WsgatewayController } from './controllers/wsgateway.controller';
import { WsgatewayService } from './services/wsgateway.service';
import { Wsgateway } from './gateway';
import { ConsumerService } from './services/consumer.service';
// import { ConsumerService2 } from './services/consumer2.service';


@Module({
  controllers: [WsgatewayController],
  providers: [WsgatewayService , Wsgateway ,  ConsumerService ],
})
export class WsgatewayModule {}
