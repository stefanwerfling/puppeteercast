import {Logger} from 'figtree';
import { Writable, PassThrough } from 'stream';

/**
 * Buffered Stream (RingBuffer)
 */
export class BufferedStream extends Writable {

    /**
     * Buffer
     * @private
     */
    protected _buffer: Buffer[] = [];

    /**
     * Max Chunks
     * @private
     */
    protected readonly _maxChunks: number;

    /**
     * Consumer
     * @private
     */
    protected _consumer: PassThrough;

    /**
     * Constructor
     * @param {number} maxChunks
     */
    public constructor(maxChunks: number = 200) {
        super();
        this._maxChunks = maxChunks;
        this._consumer = new PassThrough();
    }

    /**
     * Write
     * @param {Buffer} chunk
     * @param {string} _encoding
     * @param {function} callback
     */
    public _write(chunk: Buffer, _encoding: string, callback: (error?: Error | null) => void): void {
        if (this._buffer.length >= this._maxChunks) {
            Logger.getLogger().info(`BufferedStream:_write: clear buffer ${this._buffer.length} >= ${this._maxChunks}`);
            this._buffer.shift();
        }

        this._buffer.push(chunk);
        this._flushBuffer();
        callback();
    }

    /**
     * Flush Buffer
     * @protected
     */
    protected _flushBuffer(): void {
        while (this._buffer.length > 0 && this._consumer.writableLength < 1024 * 1024) {
            const chunk = this._buffer.shift();

            if (chunk) {
                this._consumer.write(chunk);
            }
        }
    }

    /**
     * Return the readable stream
     * @return {PassThrough}
     */
    public getReadableStream(): PassThrough {
        return this._consumer;
    }

    /**
     * End consumer
     */
    public endConsumer(): void {
        this._consumer.end();
    }

}