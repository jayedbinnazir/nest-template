// mail.consumer.ts - SIMPLIFY!
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailService } from '../services/mail.service';

@Controller()
export class MailConsumer {
  private readonly logger = new Logger(MailConsumer.name);

  constructor(private readonly mailService: MailService) {}

  @EventPattern('send_mail')
  async handleSendMail(@Payload() data: { to: string; orderId: string; customerName: string }) {
    try {
      this.logger.log(`📨 Processing mail for: ${data.to}`);
      this.logger.log(`📦 Order ID: ${data.orderId}`);

      await this.mailService.sendOrderConfirmationMail(
        data.to,
        data.orderId,
        data.customerName,
      );

      this.logger.log('✅ Mail sent successfully');
      // ✅ Let NestJS handle acknowledgment automatically!
      
    } catch (error) {
      this.logger.error(`❌ Failed to send mail: ${error.message}`);
      throw error; // Let RabbitMQ handle retry automatically
    }
  }
}