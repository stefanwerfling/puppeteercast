import { DefaultRoute } from 'figtree';
import { SchemaLineupStatusResponse } from '../../Schemas/Routes/Lineup/LineupStatus.js';
export class LineupStatus extends DefaultRoute {
    getExpressRouter() {
        this._get('/lineup_status.json', false, async (request) => {
            const baseUrl = `${request.protocol}://${request.hostname}:5004`;
            return {
                ScanInProgress: 0,
                ScanPossible: 1,
                Source: 'IPTV',
                SourceList: ['IPTV'],
                Lineup: `${baseUrl}/lineup.json`,
                Status: 'OK'
            };
        }, {
            description: 'HDHomeRun lineup_status.json',
            responseBodySchema: SchemaLineupStatusResponse
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=LineupStatus.js.map