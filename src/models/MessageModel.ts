import { Client } from "cassandra-driver";
import { Database } from "../database/database";
import IMessage from "../interfaces/IMessage";

export class MessageModel {

    client: Client

    constructor(
        private readonly database: Database
    ){
        this.client = this.database.client;
    }

    getByChat = (id: string): Promise<IMessage[]> => {
        return new Promise(async (res, rej) => {
            try {
                const query = 'SELECT * FROM messages_by_chat WHERE chat_id = ?';
                const values = [id];
                const result = await this.client.execute(query, values);
                const messages = result.rows as unknown as IMessage[];
                res(messages);
            } catch (error) {
                rej(error);
            }
        });
    };

    insert = (entity: IMessage): Promise<void> => {
        return new Promise(async (res, rej) => {
            try {
                const columns = Object.keys(entity).join(', ');
                const placeholders = Object.entries(entity).map((_) => `?`).join(', ');
                const values = Object.values(entity);

                const query = `INSERT INTO messages_by_chat (${columns}) VALUES (${placeholders})`;
                await this.client.execute(query, values);
                res();
            } catch (error) {
                rej(error);
            }
        });
    };

}