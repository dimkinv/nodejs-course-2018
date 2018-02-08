/* rest-api.ts */
import * as express from 'express';
import { router } from './person.controller';
const app = express();

app.use('/api/person', router);

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});