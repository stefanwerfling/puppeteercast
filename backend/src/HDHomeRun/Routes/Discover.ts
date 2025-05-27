import {Router} from 'express';
import {DefaultRoute} from 'figtree';
import {DiscoverResponse, SchemaDiscoverResponse} from '../../Schemas/Routes/Discover/Discover.js';

export class Discover extends DefaultRoute {

    public getExpressRouter(): Router {
        this._get(
            '/discover.json',
            false,
            async(request): Promise<DiscoverResponse> => {
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
            },
            {
                description: 'HDHomeRun discover.json',
                responseBodySchema: SchemaDiscoverResponse
            }
        );

        return super.getExpressRouter();
    }

}