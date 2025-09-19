import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Controller()
export class MailDlqConsumer {
  private readonly logger = new Logger(MailDlqConsumer.name);

  constructor() {
    this.logger.log("✅ MailDlqConsumer initialized and ready");
  }

  @EventPattern('mail_queue.dlq')
  async handleFailedMail(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    
    this.logger.warn(`📦 DLQ Message received: ${JSON.stringify(data)}`);
    
    try {
      // Log the permanent failure (save to database, send alert, etc.)
      this.logger.error(`💀 PERMANENT FAILURE - Email: ${data.to}, Order: ${data.orderId}`);
      
      // Example: Save to database for manual intervention
      // await this.savePermanentFailure(data);
      
      this.logger.log('💾 Failure logged for manual review');
      
      // Acknowledge to remove from DLQ (we've handled the failure)
      channel.ack(originalMsg);
      
    } catch (error) {
      this.logger.error(`❌ Error processing DLQ message: ${error.message}`);
      
      // Reject the DLQ message (it will stay in DLQ for reprocessing)
      channel.nack(originalMsg, false, true);
    }
  }
}