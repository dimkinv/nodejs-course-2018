import * as SocketIO from 'socket.io';
import { SOCKET_EVENTS, Message} from './items-websocket.models';

export class ItemsWebsocketController {
    constructor(private io: SocketIO.Server) {
        this.startListen();
    }

    startListen() {
        this.io.on('connect', (socket) => {
            console.log('user is connected!');
            socket.on('message', (message: Message) => {
                console.log(`${message.username} sent a ${message.action} message with payload: `, message.message);
                socket.broadcast.emit('message', message);
            });
        });
    }
}