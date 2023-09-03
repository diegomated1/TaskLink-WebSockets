import { Database } from "./database/database";
import { Server } from "socket.io";
import ChatListeners from "./listeners/UserChatListener";
import { MessageModel } from "./models/MessageModel";
import dotenv from "dotenv";
dotenv.config();

async function main(){
    const database = new Database();
    await database.connect();

    const messageModel = new MessageModel(database);

    const port = parseInt(process.env.PORT || "3000");

    const io = new Server(port);

    const chatNamespace = io.of("/chat");
    chatNamespace.on('connection', (socket)=>{
        console.log("conectado");
        const {id_chat} = socket.handshake.query;
        
        new ChatListeners(messageModel, io, socket);
    });
}

main();
