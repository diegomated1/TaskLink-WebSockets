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

    private sendMessage = async (message: IMessagePost) => {
        try {
            const image_paths: string[] = []
            let folder = path.join(__dirname, `../../uploads/chat_images/chat_${message.chat_id}`);

            for (const img of message.images) {
                let id = ui();
                let img_path = `${folder}/${id}.jpg`;
                if(!fs.existsSync(folder)) await fs.promises.mkdir(folder);

                image_paths.push(img_path);
                await fs.promises.writeFile(img_path, img);
            };
            const message_id = uuid();

            let newMessage: IMessage = {
                chat_id: message.chat_id,
                content: message.content,
                create_timestamp: (Date.now()/1000),
                has_image: message.images.length > 0,
                image_paths,
                is_read: false,
                message_id,
                receiver_id: message.receiver_id,
                sender_id: message.sender_id
            };

            await this.messageModel.insert(newMessage);

            this.socket.broadcast.to(message.chat_id).emit("chat:send_message", newMessage);
        } catch (error) {
            this.socket.emit('error', 'Could not send message', error);
        }
    };

    private getMessages = async (chat_id: string, cb: (messages: IMessage[]) => void) => {
        try {
            const messages = await this.messageModel.getByChat(chat_id);

            cb(messages);
        } catch (err) {
            cb([]);
            this.socket.emit('error', 'Error al obtener los mensajes');
        }
    }

    // socket events
    listeners() {
        this.socket.on("chat:send_message", this.sendMessage);
        this.socket.on("chat:get_messages", this.getMessages);
    }
};