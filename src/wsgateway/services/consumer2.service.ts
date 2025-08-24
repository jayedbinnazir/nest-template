// import { Injectable, OnModuleInit } from "@nestjs/common";
// import  {Socket , io}  from 'socket.io-client';


// @Injectable()
// export class ConsumerService2 implements OnModuleInit {

//     private socket: Socket;

//     onModuleInit() {

//         console.log(" I m consumer C Service")
        
//         this.socket = io("http://localhost:5000" );

//         this.socket.on("connect" , ( ) =>{
//             console.log(`[Consumer C] Connected to "A" Gateway with id: ${this.socket.id}`);
//         })

//         this.socket.on("processMessage" , (data) =>{
//             console.log(`[Consumer C] Received processMessage:`, data);

//             const payload : { toUserId:string , text:string , fromUserId:string , from:string } = {
//                 ...data,
//                 text : data.text + " - processed by Consumer C",
//             }
//             this.socket.emit("processMessage" , data )
//         })
//     }
// }