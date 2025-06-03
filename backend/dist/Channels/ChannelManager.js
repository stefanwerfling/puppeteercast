import { ServiceStatus } from 'figtree';
import { Backend } from '../Application/Backend.js';
import { PuppeteerProviders } from '../Providers/Puppeteer/PuppeteerProviders.js';
import { PuppeteerService } from '../Service/PuppeteerService.js';
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
    async _callPuppeteer(channel) {
        const puProviders = new PuppeteerProviders();
        const provider = await puProviders.getProvider(channel.provider);
        if (provider === null) {
            throw new Error(`Channel provider not found: ${channel.provider}:${channel.id}`);
        }
        const backend = Backend.getInstance(Backend.NAME);
        if (backend === null) {
            throw new Error('Internal error: Backend not found!');
        }
        const service = backend.getServiceManager().getByName(PuppeteerService.NAME);
        if (service === null) {
            throw new Error('Puppeteer-Service not found!');
        }
        if (service.getStatus() !== ServiceStatus.Success) {
            throw new Error('Puppeteer-Service not ready!');
        }
        const page = service.getPage();
        if (page === null) {
            throw new Error(`Page not ready: ${channel.provider}:${channel.id}`);
        }
        await provider.call(page, channel);
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
            if (channel === undefined) {
                throw new Error(`Channel not found: ${channelId}`);
            }
            await this._callPuppeteer(channel);
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