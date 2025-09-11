import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { CreateMailDto } from '../dto/create-mail.dto';
import { UpdateMailDto } from '../dto/update-mail.dto';


@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async create() {
    try {

    
    await this.mailService.sendOrderConfirmationMail("jayed.official1998@gmail.com", "1231321", "Jayed");
    return { message: 'Order confirmation email sent successfully' };

    } catch (err) {
      console.error('Error in create mail:', err);
      throw err;
    }
  }

}
