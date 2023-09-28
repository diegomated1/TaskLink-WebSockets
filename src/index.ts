import dotenv from "dotenv";
dotenv.config();

import { Database } from "./database/database";
import { Server } from "socket.io";
import ChatListeners from "./listeners/UserChatListener";
import { MessageModel } from "./models/MessageModel";
import RouteListener from "./listeners/RouteListener";
import { RouteModel } from "./models/RouterModel";

async function main(){
    const database = new Database();
    await database.connect();

    const messageModel = new MessageModel(database);
    const routeModel = new RouteModel(database);

    const port = parseInt(process.env.PORT || "3000");

    const io = new Server(port);

    const chatNamespace = io.of("/chat");
    chatNamespace.on('connection', (socket)=>{
        new ChatListeners(messageModel, io, socket);
    });

    const routeNamespace = io.of("/route");
    routeNamespace.on('connection', (socket) => {
        console.log("conectado");
        new RouteListener(routeModel, io, socket);
    });
}

main();
