import { DefaultRoute } from 'figtree';
import { SchemaLineupStatusResponse } from '../../Schemas/Routes/Lineup/LineupStatus.js';
export class LineupStatus extends DefaultRoute {
    getExpressRouter() {
        this._get('/dms/lineup_status.json', false, async (request) => {
            const baseUrl = `${request.protocol}://${request.hostname}:5004`;
            return {
                ScanInProgress: 0,
                ScanPossible: 1,
                Source: 'Cable',
                SourceList: ['Cable'],
                Lineup: `${baseUrl}/dms/lineup.json`,
                Status: 'OK'
            };
        }, {
            description: 'DLNA lineup_status.json',
            responseBodySchema: SchemaLineupStatusResponse
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=LineupStatus.js.map