import fs from "fs";
import { Duplex, Readable } from 'stream';
import JSONStream from "JSONStream";

/**
 * @param {Buffer} buffer 
 */
export const buildStream = (buffer) => {
    //const str = fs.createReadStream(buffer, { encoding: 'utf8' });

    const str = buffer2Stream(buffer)

    const parser = JSONStream.parse("*");

    return str.pipe(parser);
}


/**
 * @param {Buffer} myBuffer
 */
const buffer2Stream = (myBuffer) => {
    const readable = new Readable();
    readable._read = () => { };
    readable.push(myBuffer);
    readable.push(null);

    return readable;
}