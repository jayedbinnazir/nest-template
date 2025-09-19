import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class MailProducer {
  constructor(
    @Inject('MAIL_SERVICE')
    private readonly client: ClientProxy
  ) {}

  async sendMailJob(to: string, orderId: string, customerName: string) {
    this.client.emit('send_mail', { 
      to, 
      orderId, 
      customerName 
    });
  }
}