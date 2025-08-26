import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { from } from "rxjs";
import { Server, Socket } from "socket.io"


export type MessageBody = {
    toSocketId: string;
    msg: string;
    fromSocketId: string;
}



@Injectable()
@WebSocketGateway({ cors: true })
export class Wsgateway {

    @WebSocketServer()
    server: Server

    // the socket id and the userId
    private users = new Map<string, string>();

    

    handleConnection(client: Socket) {
        console.log("Client connected", { clientId: client.id , userId:client.handshake.query.userId });
    }

    handleDisconnect(client: Socket) {
        console.log(`[Gateway] Client disconnected: ${client.id}`);

    }

}