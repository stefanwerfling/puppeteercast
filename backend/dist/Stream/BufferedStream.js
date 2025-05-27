import { Logger } from 'figtree';
import { Writable, PassThrough } from 'stream';
export class BufferedStream extends Writable {
    _buffer = [];
    _maxChunks;
    _consumer;
    constructor(maxChunks = 200) {
        super();
        this._maxChunks = maxChunks;
        this._consumer = new PassThrough();
    }
    _write(chunk, _encoding, callback) {
        if (this._buffer.length >= this._maxChunks) {
            Logger.getLogger().info(`BufferedStream:_write: clear buffer ${this._buffer.length} >= ${this._maxChunks}`);
            this._buffer.shift();
        }
        this._buffer.push(chunk);
        this._flushBuffer();
        callback();
    }
    _flushBuffer() {
        while (this._buffer.length > 0 && this._consumer.writableLength < 1024 * 1024) {
            const chunk = this._buffer.shift();
            if (chunk) {
                this._consumer.write(chunk);
            }
        }
    }
    getReadableStream() {
        return this._consumer;
    }
    endConsumer() {
        this._consumer.end();
    }
}
//# sourceMappingURL=BufferedStream.js.map