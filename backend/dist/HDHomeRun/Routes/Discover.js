import { DefaultRoute } from 'figtree';
import { SchemaDiscoverResponse } from '../../Schemas/Routes/Discover/Discover.js';
export class Discover extends DefaultRoute {
    getExpressRouter() {
        this._get('/discover.json', false, async (request) => {
            const baseUrl = `${request.protocol}://${request.hostname}:5004`;
            return {
                DeviceAuth: '',
                DeviceID: 'hdhomerun-puppeteercast',
                FirmwareName: 'hdhomerun_puppeteercast',
                FirmwareVersion: '20230501',
                ModelNumber: 'HDTC-2US',
                TunerCount: 2,
                DeviceType: 'HDHomeRun',
                BaseURL: baseUrl,
                LineupURL: `${baseUrl}/lineup.json`
            };
        }, {
            description: 'HDHomeRun discover.json',
            responseBodySchema: SchemaDiscoverResponse
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=Discover.js.map