import {Router} from 'express';
import {DefaultRoute} from 'figtree';
import {LineupResponse, LinupEntry, SchemaLineupResponse} from '../../Schemas/Routes/Lineup/Lineup.js';

export class Lineup extends DefaultRoute {

    public getExpressRouter(): Router {
        this._get(
            '/lineup.json',
            false,
            async(request): Promise<LineupResponse> => {
                const list: LinupEntry[] = [];

                const baseUrl = `${request.protocol}://${request.hostname}:5004`;

                const channels = [
                    {name: 'The Index', id: 'index'},
                    {name: 'The Index 2', id: 'index2'}
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
            },
            {
                description: 'HDHomeRun lineup.json',
                responseBodySchema: SchemaLineupResponse
            }
        );

        return super.getExpressRouter();
    }

}