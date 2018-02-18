import * as express from 'express'
import * as bodyParser from 'body-parser';
import { itemsRouter } from './controllers/items/router';
const app = express();
app.use(bodyParser.json());
app.use('/api/items', itemsRouter)

app.listen(3000, () => console.log('app listening on port 3000!'))