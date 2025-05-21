import {Router} from 'express';
import {DefaultRoute} from 'figtree';

export class PlayList extends DefaultRoute {

    /**
     * Return the express router
     * @returns {Router}
     */
    public getExpressRouter(): Router {
        this._get(
            '/playlist.m3u',
            false,
            async(
                req,
                res
            ): Promise<void> => {
                const base = `${req.protocol}://${req.hostname}:3000`;

                res.header('Content-Type', 'application/x-mpegurl');

            },
            {
                description: 'playlist.m3u'
            }
        );

        return super.getExpressRouter();
    }

}