import {HttpRouteLoader, IDefaultRoute, SwaggerUIRoute} from 'figtree';
import {Play} from './API/Play.js';
import {PlayList} from './API/PlayList.js';
import {Stream} from './API/Stream.js';

/**
 * Route loader
 */
export class RouteLoader extends HttpRouteLoader {

    /**
     * Load routes for HTTP Server
     * @return {IDefaultRoute[]}
     */
    public static async loadRoutes(): Promise<IDefaultRoute[]> {
        SwaggerUIRoute.getInstance().setInfo('PuppeteerCast', '1.0.1');

        return [
            new PlayList(),
            new Stream(),
            new Play(),
            SwaggerUIRoute.getInstance()
        ];
    }

}