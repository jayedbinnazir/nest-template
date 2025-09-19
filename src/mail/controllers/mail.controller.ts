import { Controller, Post } from '@nestjs/common';
import { MailProducer } from '../services/mail.producer';

@Controller('mail')
export class MailController {
  constructor(private readonly mailProducer: MailProducer) {}

  @Post()
  async create() {
    try {
      await this.mailProducer.sendMailJob(
        "jayed.official1998@gmail.com", 
        "1231321", 
        "Jayed"
      );
      
      return { 
        message: 'Order confirmation email queued successfully',
        note: 'Email will be processed asynchronously by the consumer'
      };

    } catch (err) {
      console.error('Error in create mail:', err);
      throw err;
    }
  }
}