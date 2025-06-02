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
            '/dms/lineup_status.json',
            false,
            async(request): Promise<LineupStatusResponse> => {
                const baseUrl = `${request.protocol}://${request.hostname}:5004`;

                return {
                    ScanInProgress: 0,
                    ScanPossible: 1,
                    Source: 'Cable',
                    SourceList: ['Cable'],
                    Lineup: `${baseUrl}/dms/lineup.json`,
                    Status: 'OK'
                };
            },
            {
                description: 'DLNA lineup_status.json',
                responseBodySchema: SchemaLineupStatusResponse
            }
        );

        return super.getExpressRouter();
    }

}