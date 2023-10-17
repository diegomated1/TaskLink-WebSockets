import dotenv from "dotenv";
dotenv.config();

import { Database } from "./database/database";
import http from "http";    
import { Server } from "socket.io";
import ChatListeners from "./listeners/UserChatListener";
import { MessageModel } from "./models/MessageModel";
import RouteListener from "./listeners/RouteListener";
import { RouteModel } from "./models/RouterModel";
import LocationListeners from "./listeners/LocationListener";

async function main(){
    const database = new Database();
    await database.connect();

    const messageModel = new MessageModel(database);
    const routeModel = new RouteModel(database);

    const port = parseInt(process.env.PORT || "3000");
    const host = process.env.HOST || "localhost";

    const server = http.createServer();
    const io = new Server(server);

    const chatNamespace = io.of("/chat");
    chatNamespace.on('connection', (socket)=>{
        new ChatListeners(messageModel, io, socket);
    });

    const routeNamespace = io.of("/route");
    routeNamespace.on('connection', (socket) => {
        new RouteListener(routeModel, io, socket);
    });

    const locationNamespace = io.of("/location");
    locationNamespace.on('connection', (socket) => {
        new LocationListeners(io, socket);
    });
    
    server.listen(port, host);
}

main();
