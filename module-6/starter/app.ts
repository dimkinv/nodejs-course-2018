import * as express from 'express';
import { Server } from 'http';
import * as socketIO from 'socket.io';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { itemsRouterFactory } from './controllers/items/router';
import { ItemsWebsocketController } from './controllers/items-websocket/items-websocket.controller';

const app = express();
const http = new Server(app);
const io = socketIO(http);

const itemsWebsocketController = new ItemsWebsocketController(io);

app.use(cors());
app.use(bodyParser.json());
app.use('/api/items', itemsRouterFactory(itemsWebsocketController))

http.listen(3000, () => console.log('app listening on port 3000!'));