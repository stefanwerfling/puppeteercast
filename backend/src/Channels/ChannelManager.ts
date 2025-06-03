import {ServiceStatus} from 'figtree';
import {Backend} from '../Application/Backend.js';
import {PuppeteerProviders} from '../Providers/Puppeteer/PuppeteerProviders.js';
import {PuppeteerService} from '../Service/PuppeteerService.js';
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

    /**
     * Call channel for puppeteer
     * @param {Channel} channel
     * @protected
     */
    protected async _callPuppeteer(channel: Channel): Promise<void> {
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

        const page = (service as PuppeteerService).getPage();

        if (page === null) {
            throw new Error(`Page not ready: ${channel.provider}:${channel.id}`);
        }

        await provider.call(page, channel);
    }

    /**
     * Call a channel
     * @param {string} channelId
     */
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

            if (channel === undefined) {
                throw new Error(`Channel not found: ${channelId}`);
            }

            // by puppeteer provider -----------------------------------------------------------------------------------

            await this._callPuppeteer(channel);

            // ---------------------------------------------------------------------------------------------------------
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