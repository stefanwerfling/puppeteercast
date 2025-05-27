import dgram from 'dgram';
import {Logger} from 'figtree';
import os from 'os';

export class SsdpServerMediaServer {

    protected _portListen: number;

    protected _portHttpLocation: number;

    protected _uuid: string;

    protected _server: dgram.Socket;

    protected _localInterfaces: string[] = [];

    public constructor(portListen: number, portHttpLocation: number, uuid: string) {
        this._portListen = portListen;
        this._portHttpLocation = portHttpLocation;
        this._uuid = uuid;
        this._server = dgram.createSocket('udp4');
        this._localInterfaces = this._getLocalIPv4Interfaces();
    }

    public start(): void {
        this._server.on('message', this._onMessage.bind(this));

        this._server.bind(this._portListen, () => {
            this._server.addMembership('239.255.255.250');
        });
    }

    private _onMessage(msg: Buffer, rinfo: dgram.RemoteInfo): void {
        const message = msg.toString();

        if (
            message.includes('M-SEARCH') &&
            message.includes('urn:schemas-upnp-org:device:MediaServer:1')
        ) {
            const localIp = this._localInterfaces[0];

            if (!localIp) {
                Logger.getLogger().warn('SsdpServerMediaServer::onMessage: No local IP found for SSDP response');
                return;
            }

            const response = Buffer.from(this._buildResponse(localIp));

            this._server.send(response, 0, response.length, rinfo.port, rinfo.address);

            Logger.getLogger().info(`SsdpServerMediaServer::onMessage: Sent SSDP response to ${rinfo.address}:${rinfo.port} with LOCATION http://${localIp}:${this._portHttpLocation}/device.xml`);
        }
    }

    /**
     * Build response
     * @param {string} localIp
     * @private
     */
    private _buildResponse(localIp: string): string {
        return [
            'HTTP/1.1 200 OK',
            'CACHE-CONTROL: max-age=1800',
            `DATE: ${new Date().toUTCString()}`,
            'EXT:',
            `LOCATION: http://${localIp}:${this._portHttpLocation}/device.xml`,
            'SERVER: Node/HDHomeRun',
            'ST: urn:schemas-upnp-org:device:MediaServer:1',
            `USN: uuid:${this._uuid}::urn:schemas-upnp-org:device:MediaServer:1`,
            '',
            ''
        ].join('\r\n');
    }

    private _getLocalIPv4Interfaces(): string[] {
        const interfaces = os.networkInterfaces();
        const result: string[] = [];

        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]!) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    result.push(iface.address);
                }
            }
        }

        return result;
    }

}