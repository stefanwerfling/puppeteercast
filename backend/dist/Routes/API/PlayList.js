import { DefaultRoute } from 'figtree';
export class PlayList extends DefaultRoute {
    getExpressRouter() {
        this._get('/playlist.m3u', false, async (req, res) => {
            const base = `${req.protocol}://${req.get('host')}`;
            res.header('Content-Type', 'application/x-mpegurl');
            const channels = [
                { name: 'The Index', id: 'index' },
                { name: 'The Index 2', id: 'index2' }
            ];
            const m3u = ['#EXTM3U'];
            for (const channel of channels) {
                m3u.push(`#EXTINF:-1,${channel.name}`);
                m3u.push(`${base}/stream/${channel.id}.ts`);
            }
            res.header('Content-Type', 'application/x-mpegurl');
            res.send(m3u.join('\n'));
        }, {
            description: 'playlist.m3u'
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=PlayList.js.map