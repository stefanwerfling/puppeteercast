import dgram from 'dgram';
import { Logger } from 'figtree';
import os from 'os';
export class SsdpServer {
    _portListen;
    _portHttpLocation;
    _server;
    _localInterfaces = [];
    _deviceTypes = new Map();
    constructor(portListen, portHttpLocation, deviceTypes) {
        this._portListen = portListen;
        this._portHttpLocation = portHttpLocation;
        this._server = dgram.createSocket('udp4');
        this._localInterfaces = this._getLocalIPv4Interfaces();
        for (const dt of deviceTypes) {
            this._deviceTypes.set(dt.type, dt);
        }
    }
    _getLocalIPv4Interfaces() {
        const interfaces = os.networkInterfaces();
        const result = [];
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    result.push(iface.address);
                }
            }
        }
        return result;
    }
    start() {
        this._server.on('message', this._onMessage.bind(this));
        this._server.bind(this._portListen, () => {
            this._server.setMulticastTTL(2);
            this._server.setBroadcast(true);
            this._server.addMembership('239.255.255.250');
            this._sendNotifySchedule();
            setInterval(() => this._sendNotifySchedule(), 30 * 1000);
        });
    }
    _sendNotifySchedule() {
        const localIp = this._localInterfaces[0];
        if (!localIp) {
            Logger.getLogger().warn('SsdpServer::_sendNotifySchedule: No local IP found for SSDP response');
            return;
        }
        for (const [, dtype] of this._deviceTypes.entries()) {
            this._sendNotify(localIp, dtype.uuid, 'upnp:rootdevice', dtype.deviceUrl);
            this._sendNotify(localIp, dtype.uuid, '', dtype.deviceUrl);
            this._sendNotify(localIp, dtype.uuid, `urn:schemas-upnp-org:device:${dtype.type}:1`, dtype.deviceUrl);
        }
    }
    _onMessage(msg, rinfo) {
        const message = msg.toString();
        const lines = message.split(/\r?\n/u);
        let st = '';
        for (const line of lines) {
            const parts = line.split(':');
            if (parts.length >= 3 && parts[0].trim().toUpperCase() === 'ST') {
                st = `${parts[parts.length - 2].trim()}:${parts[parts.length - 1].trim()}`;
            }
        }
        if (message.includes('M-SEARCH') && st) {
            const localIp = this._localInterfaces[0];
            if (!localIp) {
                Logger.getLogger().warn('SsdpServer::onMessage: No local IP found for SSDP response');
                return;
            }
            if (st === 'ssdp:all') {
                for (const [, dtype] of this._deviceTypes.entries()) {
                    this._sendResponse(localIp, dtype.uuid, 'upnp:rootdevice', dtype.deviceUrl, rinfo);
                    this._sendResponse(localIp, dtype.uuid, '', dtype.deviceUrl, rinfo);
                    this._sendResponse(localIp, dtype.uuid, `urn:schemas-upnp-org:device:${dtype.type}:1`, dtype.deviceUrl, rinfo);
                }
            }
            else if (this._deviceTypes.has(st)) {
                const dtype = this._deviceTypes.get(st);
                if (dtype !== undefined) {
                    this._sendResponse(localIp, dtype.uuid, `urn:schemas-upnp-org:device:${dtype.type}:1`, dtype.deviceUrl, rinfo);
                }
            }
        }
        else {
            Logger.getLogger().silly(`SsdpServer::onMessage: unknown message: ${message}`);
        }
    }
    _geResponseHead() {
        return [
            'HTTP/1.1 200 OK',
            'CACHE-CONTROL: max-age=1800',
            `DATE: ${new Date().toUTCString()}`,
            'EXT:',
            'SERVER: UPnP/1.1 PuppeteerCast/1.0 DLNADOC/1.51',
        ];
    }
    _buildResponse(localIp, uuid, urn, deviceUrl) {
        return [
            ...this._geResponseHead(),
            `LOCATION: http://${localIp}:${this._portHttpLocation}/${deviceUrl}`,
            `ST: ${urn === '' ? `uuid:${uuid}` : urn}`,
            `USN: ${urn === '' ? `uuid:${uuid}` : `uuid:${uuid}::${urn}`}`,
            '',
            ''
        ].join('\r\n');
    }
    _sendResponse(localIp, uuid, urn, deviceUrl, rinfo) {
        const response = Buffer.from(this._buildResponse(localIp, uuid, urn, deviceUrl));
        this._server.send(response, 0, response.length, rinfo.port, rinfo.address);
        Logger.getLogger().info(`SsdpServer::onMessage: Sent SSDP response to ${rinfo.address}:${rinfo.port} with LOCATION http://${localIp}:${this._portHttpLocation}/${deviceUrl}`);
    }
    _buildNotify(localIp, uuid, urn, deviceUrl) {
        return [
            'NOTIFY * HTTP/1.1',
            `HOST: 239.255.255.250:${this._portListen}`,
            'CACHE-CONTROL: max-age=1800',
            `LOCATION: http://${localIp}:${this._portHttpLocation}/${deviceUrl}`,
            `NT: ${urn === '' ? `uuid:${uuid}` : urn}`,
            'NTS: ssdp:alive',
            'SERVER: UPnP/1.1 PuppeteerCast/1.0 DLNADOC/1.51',
            `USN: ${urn === '' ? `uuid:${uuid}` : `uuid:${uuid}::${urn}`}`,
            '',
            ''
        ].join('\r\n');
    }
    _sendNotify(localIp, uuid, urn, deviceUrl) {
        const notify = Buffer.from(this._buildNotify(localIp, uuid, urn, deviceUrl));
        this._server.send(notify, 1900, '239.255.255.250');
    }
}
//# sourceMappingURL=SsdpServer.js.map