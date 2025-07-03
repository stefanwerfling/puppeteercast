import { HttpRouteLoader, ServiceRoute, SwaggerUIRoute } from 'figtree';
import { Backend } from '../Application/Backend.js';
import { Play } from './API/Play.js';
import { PlayList } from './API/PlayList.js';
import { Puppeteer } from './API/Puppeteer.js';
import { Stream } from './API/Stream.js';
import { Youtube } from './API/Youtube.js';
export class RouteLoader extends HttpRouteLoader {
    static async loadRoutes() {
        SwaggerUIRoute.getInstance().setInfo('PuppeteerCast', '1.0.1');
        return [
            new ServiceRoute(Backend.NAME, false),
            new PlayList(),
            new Stream(),
            new Play(),
            new Puppeteer(),
            new Youtube(),
            SwaggerUIRoute.getInstance()
        ];
    }
}
//# sourceMappingURL=RouteLoader.js.map