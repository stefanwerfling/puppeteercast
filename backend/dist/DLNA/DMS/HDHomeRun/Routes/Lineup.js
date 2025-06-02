import { DefaultRoute } from 'figtree';
import { SchemaLineupResponse } from '../../../../Schemas/Routes/Lineup/Lineup.js';
export class Lineup extends DefaultRoute {
    getExpressRouter() {
        this._get('/lineup.json', false, async (request) => {
            const list = [];
            const baseUrl = `${request.protocol}://${request.hostname}:5004`;
            const channels = [
                { name: 'The Index', id: 'index' },
                { name: 'The Index 2', id: 'index2' }
            ];
            for (const channel of channels) {
                list.push({
                    GuideNumber: channel.id,
                    GuideName: channel.name,
                    URL: `${baseUrl}/stream/${channel.id}.ts`,
                    HD: true,
                    Favorite: false
                });
            }
            return list;
        }, {
            description: 'HDHomeRun lineup.json',
            responseBodySchema: SchemaLineupResponse
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=Lineup.js.map