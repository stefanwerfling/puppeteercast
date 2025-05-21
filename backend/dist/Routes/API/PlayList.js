import { DefaultRoute } from 'figtree';
export class PlayList extends DefaultRoute {
    getExpressRouter() {
        this._get('/playlist.m3u', false, async (req, res) => {
            const base = `${req.protocol}://${req.hostname}:3000`;
            res.header('Content-Type', 'application/x-mpegurl');
        }, {
            description: 'playlist.m3u'
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=PlayList.js.map