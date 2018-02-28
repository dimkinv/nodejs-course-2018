import * as fs from 'fs';
import { Transform } from 'stream';

const writableStream = fs.createWriteStream('./output.txt');
const readableStream = process.stdin;

const transformA = new Transform({
    transform(chunk, encoding, callback) {
        callback(null, chunk.toString().replace(/\a/g,'@'));
    }
  });


readableStream
    .pipe(transformA)
    .pipe(writableStream);
