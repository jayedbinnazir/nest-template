import { Module } from '@nestjs/common';
import { MailController } from './controllers/mail.controller';
import { MailService } from './services/mail.service';
;

@Module({
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
