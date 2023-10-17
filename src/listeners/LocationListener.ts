import { Server, Socket } from 'socket.io';
import { ILocation } from 'interfaces/ILocation';

export default class LocationListeners {

    constructor(
        private readonly io: Server,
        private readonly socket: Socket
    ) {
        this.listeners();
    }

    private sendMyLocation = async (location: ILocation) => {
        try {
            this.socket.broadcast.emit("location:add", location);
        } catch (error) {
            this.socket.emit("error", (error as Error).message);
        }
    };

    // socket events
    listeners() {
        this.socket.on("location:add", this.sendMyLocation);
    }
};