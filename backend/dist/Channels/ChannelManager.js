export class ChannelManager {
    _channels = new Map();
    _isCalled = false;
    addChannel(channel) {
        if (!this._channels.has(channel.id)) {
            this._channels.set(channel.id, channel);
        }
    }
    getChannelList() {
        return Array.from(this._channels.values());
    }
    async callChannel(channelId) {
        if (this._isCalled) {
            throw new Error('A other channel is called!');
        }
        if (!this._channels.has(channelId)) {
            throw new Error('Channel not found!');
        }
        this._isCalled = true;
        let error = null;
        try {
            const channel = this._channels.get(channelId);
        }
        catch (e) {
            error = e;
        }
        finally {
            this._isCalled = false;
        }
        if (error) {
            throw error;
        }
    }
}
//# sourceMappingURL=ChannelManager.js.map