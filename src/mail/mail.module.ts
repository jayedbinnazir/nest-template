import { Module } from '@nestjs/common';
import { MailController } from './controllers/mail.controller';
import { MailService } from './services/mail.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailProducer } from './services/mail.producer';
import { MailConsumer } from './controllers/mail.consumer';
import { MailDlqConsumer } from './controllers/mail.dlq.consumer';
;

@Module({
  imports:[
     ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'mail_queue',
          persistent: true, // Add this to make messages persistent
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': '',
              'x-dead-letter-routing-key': 'mail_queue.dlq',
              'x-message-ttl': 60000, // 60 seconds message TTL
            },
          },
        },
      },
    ]),
  ],
  controllers: [MailController , MailConsumer , MailDlqConsumer ],
  providers: [MailService , MailProducer],
  exports:[MailProducer]
})
export class MailModule {}
