import {Channel} from './Channel.js';

/**
 * Stream Manager
 */
export class ChannelManager {

    /**
     * Channel list
     * @protected
     */
    protected _channels: Map<string, Channel> = new Map<string, Channel>();

    /**
     * Is a channel called
     * @protected
     */
    protected _isCalled: boolean = false;

    /**
     * Add a channel
     * @param {Channel} channel
     */
    public addChannel(channel: Channel): void {
        if (!this._channels.has(channel.id)) {
            this._channels.set(channel.id, channel);
        }
    }

    /**
     * Get a list with channels
     * @return {Channel[]}
     */
    public getChannelList(): Channel[] {
        return Array.from(this._channels.values());
    }

    public async callChannel(channelId: string): Promise<void> {
        if (this._isCalled) {
            throw new Error('A other channel is called!');
        }

        if (!this._channels.has(channelId)) {
            throw new Error('Channel not found!');
        }

        this._isCalled = true;
        let error: unknown|null = null;

        try {
            const channel = this._channels.get(channelId);


        } catch (e) {
            error = e;
        } finally {
            this._isCalled = false;
        }

        if (error) {
            throw error;
        }
    }

}