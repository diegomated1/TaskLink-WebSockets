import IMessage from '../interfaces/IMessage';
import { MessageModel } from '../models/MessageModel';
import { Server, Socket } from 'socket.io';
import IMessagePost from '../interfaces/IMessagePost';
import fs from "fs";
import ui from "uniqid";
import path from "path";
import { v4 as uuid } from 'uuid';

export default class ChatListeners {

    constructor(
        private readonly messageModel: MessageModel,
        private readonly io: Server,
        private readonly socket: Socket
    ) {
        this.listeners();
    }

    private sendMessage = async (message: IMessagePost, message_uuid: string) => {
        try {
            const image_paths: string[] = []
            let folder = path.join(__dirname, `../../uploads/chat_images/chat_${message.chat_id}`);

            for(let i=0;i<message.images.length;i++){
                let id = ui();
                let img_path = `${folder}/${id}.jpg`;
                if(!fs.existsSync(folder)) await fs.promises.mkdir(folder);

                image_paths.push(img_path);
                await fs.promises.writeFile(img_path, message.images[i]);
            }

            const message_id = uuid();

            let newMessage: IMessage = {
                chat_id: message.chat_id,
                content: message.content,
                create_timestamp: new Date(),
                has_image: message.images.length > 0,
                image_paths,
                is_read: false,
                message_id,
                receiver_id: message.receiver_id,
                sender_id: message.sender_id
            };

            await this.messageModel.insert(newMessage);
            this.socket.broadcast.to(message.chat_id).emit("chat:send_message", newMessage);
            this.socket.emit("chat:message_sended", message_uuid);
        } catch (error) {
            console.log(error);
            this.socket.emit("error", "No se pudo enviar el mensaje, intenta mas tarde.");
        }
    };

    private getMessages = async (chat_id: string) => {
        try {
            this.socket.join(chat_id);
            const messages = await this.messageModel.getByChat(chat_id);
            this.socket.emit("chat:get_messages", messages);
        } catch (err) {
            this.socket.emit("error", "No se pudieron obtener los mensajes, intenta mas tarde.");
        }
    }

    // socket events
    listeners() {
        this.socket.on("chat:send_message", this.sendMessage);
        this.socket.on("chat:get_messages", this.getMessages);
    }
};