import {BackendApp, ConfigOptions, DefaultArgs, Config, SchemaDefaultArgs, HttpService, PluginService} from 'figtree';
import {Schema} from 'vts';
import {ChannelManager} from '../Channels/ChannelManager.js';
import {PuppeteerCastConfig} from '../Config/PuppeteerCastConfig.js';
import {RouteLoader} from '../Routes/RouteLoader.js';
import {FfmpegService} from '../Service/FfmpegService.js';
import {DLNAService} from '../Service/DLNAService.js';
import {PactlService} from '../Service/PactlService.js';
import {PulseAudioService} from '../Service/PulseAudioService.js';
import {PuppeteerService} from '../Service/PuppeteerService.js';
import {XvfbService} from '../Service/XvfbService.js';

/**
 * Backend
 */
export class Backend extends BackendApp<DefaultArgs, ConfigOptions> {

    /**
     * Backend Name
     */
    public static NAME = 'puppeteercast';

    /**
     * Channel Manager
     * @protected
     */
    protected _channelManager: ChannelManager = new ChannelManager();

    /**
     * Get config instacne
     * @return {Config}
     * @protected
     */
    protected _getConfigInstance(): Config<ConfigOptions> {
        const config = PuppeteerCastConfig.getInstance();
        config.setAppName(Backend.NAME);
        config.setAppTitle('PuppeteerCast');

        return config;
    }

    /**
     * Constructor
     */
    public constructor() {
        super(Backend.NAME);
    }

    /**
     * Get arg schema
     * @protected
     */
    protected _getArgSchema(): Schema<DefaultArgs>|null {
        return SchemaDefaultArgs;
    }

    /**
     * Init Services
     * @protected
     */
    protected async _initServices(): Promise<void> {
        this._serviceManager.add(new PluginService(Backend.NAME));
        this._serviceManager.add(new XvfbService());
        this._serviceManager.add(new PulseAudioService());
        this._serviceManager.add(new PuppeteerService());
        this._serviceManager.add(new PactlService());
        this._serviceManager.add(new FfmpegService());
        this._serviceManager.add(new HttpService(RouteLoader));
        this._serviceManager.add(new DLNAService());
    }

    /**
     * Return the channel manager
     * @return {ChannelManager}
     */
    public getChannelManager(): ChannelManager {
        return this._channelManager;
    }

}