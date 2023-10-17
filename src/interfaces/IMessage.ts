export default interface IMessage {
    chat_id: string;
    message_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    create_timestamp: Date;
    is_read: boolean;
    has_image: boolean;
    image_paths: string[];
}