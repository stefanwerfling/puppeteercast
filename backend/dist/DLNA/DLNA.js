import { BaseHttpServer } from 'figtree';
import { v4 as uuid } from 'uuid';
import { Stream } from '../Routes/API/Stream.js';
import { AVTransport as DMRAVTransport } from './DMR/AVTransport.js';
import { ConnectionManager } from './DMR/ConnectionManager.js';
import { Device as DMRDevice } from './DMR/Device.js';
import { RenderingControl as DMRRenderingControl } from './DMR/RenderingControl.js';
import { Device as DMSDevice } from './DMS/Device.js';
import { Discover as DMSDiscover } from './DMS/Discover.js';
import { Lineup as DMSLineup } from './DMS/Lineup.js';
import { LineupStatus as DMSLineupStatus } from './DMS/LineupStatus.js';
import { SsdpServer } from './Ssdp/SsdpServer.js';
export class DLNA {
    _httpServer;
    _ssdp;
    constructor() {
        const dmrUuid = uuid();
        const dmsUuid = uuid();
        const httpPort = 5004;
        const ssl_path = '';
        const session_secret = uuid();
        const session_cookie_path = '/';
        const session_cookie_max_age = 6000000;
        this._httpServer = new BaseHttpServer({
            realm: 'puppeteercast-dlna',
            port: 5004,
            publicDir: '',
            session: {
                secret: session_secret,
                ssl_path: ssl_path,
                cookie_path: session_cookie_path,
                max_age: session_cookie_max_age
            },
            routes: [
                new DMRDevice(dmrUuid),
                new DMRRenderingControl(),
                new DMRAVTransport(),
                new ConnectionManager(),
                new Stream(),
                new DMSDevice(dmsUuid),
                new DMSDiscover(),
                new DMSLineup(),
                new DMSLineupStatus()
            ]
        });
        this._ssdp = new SsdpServer(1900, httpPort, [
            {
                type: 'MediaRenderer',
                deviceUrl: 'dmr/device.xml',
                uuid: dmrUuid
            },
            {
                type: 'MediaServer',
                deviceUrl: 'dms/device.xml',
                uuid: dmsUuid
            }
        ]);
    }
    async start() {
        await this._httpServer.listen();
        this._ssdp.start();
    }
}
//# sourceMappingURL=DLNA.js.map