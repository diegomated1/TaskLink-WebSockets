export default interface IMessagePost {
    chat_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    images: (string | NodeJS.ArrayBufferView)[];
}