import {BaseHttpServer} from 'figtree';
import {v4 as uuid} from 'uuid';
import {Stream} from '../Routes/API/Stream.js';
import {Device} from './Routes/Device.js';
import {Discover} from './Routes/Discover.js';
import {Lineup} from './Routes/Lineup.js';
import {LineupStatus} from './Routes/LineupStatus.js';
import {SsdpServerMediaServer} from './Ssdp/SsdpServerMediaServer.js';

/**
 * HDHomeRun
 */
export class HDHomeRun {

    /**
     * Http Server
     * @protected
     */
    protected _httpServer: BaseHttpServer;

    /**
     * SSDP Server
     * @protected
     */
    protected _ssdp: SsdpServerMediaServer;

    /**
     * Constructor
     */
    public constructor() {
        const hdhruuid = 'hdhomerun-puppeteercast';
        const httpPort = 5004;
        const ssl_path = '';
        const session_secret = uuid();
        const session_cookie_path = '/';
        const session_cookie_max_age = 6000000;

        this._httpServer = new BaseHttpServer({
            realm: 'HDHomeRun',
            port: 5004,
            publicDir: '',
            session: {
                secret: session_secret,
                ssl_path: ssl_path,
                cookie_path: session_cookie_path,
                max_age: session_cookie_max_age
            },
            routes: [
                new Stream(),
                new Device(hdhruuid),
                new Discover(),
                new Lineup(),
                new LineupStatus()
            ]
        });

        this._ssdp = new SsdpServerMediaServer(1900, httpPort, hdhruuid);
    }

    /**
     * Start the HDHomeRun (listen, ...)
     */
    public async start(): Promise<void> {
        await this._httpServer.listen();
        this._ssdp.start();
    }

}