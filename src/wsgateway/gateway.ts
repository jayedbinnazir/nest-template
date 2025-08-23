import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { from } from "rxjs";
import { Server, Socket } from "socket.io"

@Injectable()
@WebSocketGateway({ cors: true })
export class Wsgateway {

    @WebSocketServer()
    server: Server

    // the socket id and the userId
    private users = new Map<string, string>();

    // When the module is initialized

    handleConnection(client: Socket) {
        console.log("Client connected", client.id);  // userId → socketId
    }

    handleDisconnect(client: Socket) {
        console.log(`[Gateway] Client disconnected: ${client.id}`);

        for (const [userId, socketId] of this.users.entries()) {
            if (socketId === client.id) {
                this.users.delete(userId);
                break;
            }
        }
    }


    // A client sends a new direct message
    @SubscribeMessage('newMessage')
    handleNewMessage(
        @MessageBody() data: { toUserId: string; text: string , fromUserId: string},
        @ConnectedSocket() client: Socket,
    ) {
        console.log(`[Gateway] Received newMessage from ${client.id}:`, data );

        // Register the sender's userId with their socketId
        this.users.set(data.fromUserId, client.id);

        // Forward to Consumer for processing
        this.server.emit('processMessage', { ...data, from: client.id });
        console.log(`[Gateway] Forwarded to Consumer:`, { ...data, from: client.id });
    }


    @SubscribeMessage("processMessage")
    handleProcessMessage( 
        @MessageBody() data: { toUserId: string; text: string; fromUserId: string, from: string },
    ) {
        console.log(`[Gateway] Processing message for ${data.toUserId}:`, data);

        const recipientSocketId = this.users.get(data.toUserId);
        if (recipientSocketId) {
            this.server.to(recipientSocketId).emit('message', { from: data.fromUserId, text: data.text });
            console.log(`[Gateway] Sent message to ${data.toUserId} (socket ${recipientSocketId}):`, { from: data.fromUserId, text: data.text });
        } else {
            console.log(`[Gateway] User ${data.toUserId} not connected. Message not sent.`);
        }

    }

}