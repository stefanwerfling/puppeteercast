import {StreamChannel} from './StreamChannel.js';

/**
 * Stream Manager
 */
export class StreamManager {

    /**
     * Channel list
     * @protected
     */
    protected _channels: Map<string, StreamChannel> = new Map<string, StreamChannel>();

    public addChannel(channel: StreamChannel): void {
        if (!this._channels.has(channel.id)) {
            this._channels.set(channel.id, channel);
        }
    }

    public getChannelList(): StreamChannel[] {
        return Array.from(this._channels.values());
    }

    public async callChannel(channelId: string): Promise<void> {
        if (this._channels.has(channelId)) {
            const channel = this._channels.get(channelId);


        }
    }

}