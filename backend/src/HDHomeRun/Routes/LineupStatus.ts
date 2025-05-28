import {Router} from 'express';
import {DefaultRoute} from 'figtree';
import {LineupStatusResponse, SchemaLineupStatusResponse} from '../../Schemas/Routes/Lineup/LineupStatus.js';

/**
 * Lineup Status Route
 */
export class LineupStatus extends DefaultRoute {

    /**
     * Return the express router
     * @return {Router}
     */
    public getExpressRouter(): Router {
        this._get(
            '/lineup_status.json',
            false,
            async(request): Promise<LineupStatusResponse> => {
                const baseUrl = `${request.protocol}://${request.hostname}:5004`;

                return {
                    ScanInProgress: 0,
                    ScanPossible: 1,
                    Source: 'IPTV',
                    SourceList: ['IPTV'],
                    Lineup: `${baseUrl}/lineup.json`,
                    Status: 'OK'
                };
            },
            {
                description: 'HDHomeRun lineup_status.json',
                responseBodySchema: SchemaLineupStatusResponse
            }
        );

        return super.getExpressRouter();
    }

}