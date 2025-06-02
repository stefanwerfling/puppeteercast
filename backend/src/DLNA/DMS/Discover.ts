import {Router} from 'express';
import {DefaultRoute} from 'figtree';
import {DiscoverResponse, SchemaDiscoverResponse} from '../../Schemas/Routes/Discover/Discover.js';

export class Discover extends DefaultRoute {

    public getExpressRouter(): Router {
        this._get(
            '/dms/discover.json',
            false,
            async(request): Promise<DiscoverResponse> => {
                const baseUrl = `${request.protocol}://${request.hostname}:5004`;

                return {
                    FriendlyName: `PuppeteerCast ${request.hostname}`,
                    Manufacturer: 'PuppeteerCast',
                    DeviceAuth: '',
                    DeviceID: 'dlna-puppeteercast-v-1',
                    FirmwareName: 'dlna_puppeteercast',
                    FirmwareVersion: '1.0',
                    ModelNumber: 'V-1',
                    TunerCount: 2,
                    DeviceType: 'HDHR5-4DT',
                    BaseURL: baseUrl,
                    LineupURL: `${baseUrl}/dms/lineup.json`
                };
            },
            {
                description: 'DLNA discover.json',
                responseBodySchema: SchemaDiscoverResponse
            }
        );

        return super.getExpressRouter();
    }

}