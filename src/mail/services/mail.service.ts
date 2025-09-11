import { Injectable } from '@nestjs/common';
import { CreateMailDto } from '../dto/create-mail.dto';
import { UpdateMailDto } from '../dto/update-mail.dto';
import { transporter } from "../../lib/transporter";



@Injectable()
export class MailService {
  
  async sendOrderConfirmationMail(to: string, orderId: string, customerName: string) {
  const subject = `Order #${orderId} Confirmed!`;
  const html = `
    <h1>Hi ${customerName}</h1>
    <p>Thank you for your order. Your order #${orderId} has been confirmed.</p>
    <p>We will notify you when it ships.</p>
  `;
  const text = `Hi ${customerName},\n\nThank you for your order. Your order #${orderId} has been confirmed.`;

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html,
  });

  console.log('Order confirmation email sent:', info.accepted);
}

}
