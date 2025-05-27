export class StreamManager {
    _channels = new Map();
    addChannel(channel) {
        if (!this._channels.has(channel.id)) {
            this._channels.set(channel.id, channel);
        }
    }
    getChannelList() {
        return Array.from(this._channels.values());
    }
    async callChannel(channelId) {
        if (this._channels.has(channelId)) {
            const channel = this._channels.get(channelId);
        }
    }
}
//# sourceMappingURL=StreamManager.js.map