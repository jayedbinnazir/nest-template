import { Injectable, OnModuleInit } from "@nestjs/common";
import { Socket, io } from 'socket.io-client';
import { MessageBody } from "../gateway";


@Injectable()
export class ConsumerService implements OnModuleInit {

    private socket: Socket;

    onModuleInit() {

        console.log(" I m consumer B Service")

        this.socket = io("http://localhost:5000", {
            query: { userId:"1" }
        });

        this.socket.on("connect", () => {
            console.log(`[Consumer B] Connected to "A" Gateway with id: ${this.socket.id}`);
        })

    }
}