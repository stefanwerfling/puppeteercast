import { DefaultRoute, SchemaDefaultReturn } from 'figtree';
import { SchemaPlayLoopTubPlayVideo } from '../../Schemas/Routes/Play/PlayLoopTub.js';
import { PlayLoopTub } from './Play/PlayLoopTub.js';
export class Play extends DefaultRoute {
    getExpressRouter() {
        this._get('/play/looptub/:videoid', false, async (req, res, data) => {
            return PlayLoopTub.playMovie(data.params);
        }, {
            description: 'Play a movie by videoid',
            pathSchema: SchemaPlayLoopTubPlayVideo,
            responseBodySchema: SchemaDefaultReturn
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=Play.js.map