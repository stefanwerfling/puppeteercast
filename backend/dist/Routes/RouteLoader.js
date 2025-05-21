import { HttpRouteLoader, SwaggerUIRoute } from 'figtree';
import { Play } from './API/Play.js';
import { PlayList } from './API/PlayList.js';
import { Stream } from './API/Stream.js';
export class RouteLoader extends HttpRouteLoader {
    static async loadRoutes() {
        SwaggerUIRoute.getInstance().setInfo('PuppeteerCast', '1.0.1');
        return [
            new PlayList(),
            new Stream(),
            new Play(),
            SwaggerUIRoute.getInstance()
        ];
    }
}
//# sourceMappingURL=RouteLoader.js.map