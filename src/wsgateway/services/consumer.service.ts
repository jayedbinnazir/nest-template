import { Injectable, OnModuleInit } from "@nestjs/common";
import  {Socket , io}  from 'socket.io-client';
import { PayLoad } from "../gateway";


@Injectable()
export class ConsumerService implements OnModuleInit {

    private socket: Socket;

    onModuleInit() {

        console.log(" I m consumer B Service")
        
        this.socket = io("http://localhost:5000" );

        this.socket.on("connect" , ( ) =>{
            console.log(`[Consumer B] Connected to "A" Gateway with id: ${this.socket.id}`);
        })

        this.socket.on("processMessage" , (data:PayLoad) =>{
            console.log(`[Consumer B] Received processMessage:`, data);

            const payload : PayLoad = {
                ...data,
                msg : data.msg + " - processed by Consumer B",
            }
            this.socket.emit("processMessage" , data )
        })
    }
}