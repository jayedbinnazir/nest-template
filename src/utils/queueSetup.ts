import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { connect } from "amqplib";

export async function setupQueue() {
    const url = 'amqp://guest:guest@localhost:5672';
    const queue = 'mail_queue';
    const dlq = 'mail_queue.dlq';
    
    try {
        const connection = await connect(url);
        const channel = await connection.createChannel();

        try {
            await channel.deleteQueue(queue);
            await channel.deleteQueue(dlq);
            console.log('Queues deleted successfully');
        } catch (error) {
            console.log('Queues did not exist or could not be deleted');
        }

        await channel.close();
        await connection.close();
        console.log('Queues setup completed');

        return [
            {
                transport: Transport.RMQ,
                options: {
                    urls: [url],
                    queue: queue,
                    noAck: false,
                    // ADD THESE OPTIONS:
                    socketOptions: { noDelay: true },
                    queueOptions: {
                        durable: true,
                        arguments: {
                            'x-dead-letter-exchange': '',
                            'x-dead-letter-routing-key': dlq,
                            'x-message-ttl': 60000,
                        },
                    },
                },
            },
            {
                transport: Transport.RMQ,
                options: {
                    urls: [url],
                    queue: dlq,
                    // ADD THESE OPTIONS:
                    socketOptions: { noDelay: true },
                    queueOptions: {
                        durable: true,
                    },
                },
            }
        ] as MicroserviceOptions[];

    } catch (error) {
        console.error('Error setting up queue:', error);
        throw error;
    }
}