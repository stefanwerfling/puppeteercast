import dgram from 'dgram';
import {Logger} from 'figtree';
import os from 'os';

export type SsdpServerDeviceType = {
    type: string;
    deviceUrl: string;
    uuid: string;
};

/**
 * SsdpServer
 */
export class SsdpServer {

    /**
     * Port listen ssdp
     * @protected
     */
    protected _portListen: number;

    /**
     * Port Http Location
     * @protected
     */
    protected _portHttpLocation: number;

    /**
     * Server socket
     * @protected
     */
    protected _server: dgram.Socket;

    /**
     * local interfaces
     * @protected
     */
    protected _localInterfaces: string[] = [];

    /**
     * Device Types list
     * @protected
     */
    protected _deviceTypes: Map<string, SsdpServerDeviceType> = new Map<string, SsdpServerDeviceType>();

    /**
     * Constructor
     * @param {number} portListen
     * @param {number} portHttpLocation
     * @param {SsdpServerDeviceType[]} deviceTypes
     */
    public constructor(portListen: number, portHttpLocation: number, deviceTypes: SsdpServerDeviceType[]) {
        this._portListen = portListen;
        this._portHttpLocation = portHttpLocation;
        this._server = dgram.createSocket('udp4');
        this._localInterfaces = this._getLocalIPv4Interfaces();

        for (const dt of deviceTypes) {
            this._deviceTypes.set(dt.type, dt);
        }
    }

    /**
     * Get local IPv4 interfaces
     * @return {string[]}
     * @private
     */
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

    /**
     * Start the server listing
     */
    public start(): void {
        this._server.on('message', this._onMessage.bind(this));

        this._server.bind(this._portListen, () => {
            this._server.setMulticastTTL(2);
            this._server.setBroadcast(true);
            this._server.addMembership('239.255.255.250');
            this._sendNotifySchedule();

            setInterval(() => this._sendNotifySchedule(), 30 * 1000);
        });
    }

    private _sendNotifySchedule(): void {
        const localIp = this._localInterfaces[0];

        if (!localIp) {
            Logger.getLogger().warn('SsdpServer::_sendNotifySchedule: No local IP found for SSDP response');
            return;
        }

        for (const [, dtype] of this._deviceTypes.entries()) {
            this._sendNotify(
                localIp,
                dtype.uuid,
                'upnp:rootdevice',
                dtype.deviceUrl
            );

            this._sendNotify(
                localIp,
                dtype.uuid,
                '',
                dtype.deviceUrl
            );

            this._sendNotify(
                localIp,
                dtype.uuid,
                `urn:schemas-upnp-org:device:${dtype.type}:1`,
                dtype.deviceUrl
            );
        }
    }

    /**
     * On Message
     * @param {Buffer} msg
     * @param {dgram.RemoteInfo} rinfo
     * @private
     */
    private _onMessage(msg: Buffer, rinfo: dgram.RemoteInfo): void {
        const message = msg.toString();
        const lines = message.split(/\r?\n/u);

        let st = '';

        for (const line of lines) {
            const parts = line.split(':');

            if (parts.length >= 3  && parts[0].trim().toUpperCase() === 'ST') {
                st = `${parts[parts.length-2].trim()}:${parts[parts.length-1].trim()}`;
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
                    this._sendResponse(
                        localIp,
                        dtype.uuid,
                        'upnp:rootdevice',
                        dtype.deviceUrl,
                        rinfo
                    );

                    this._sendResponse(
                        localIp,
                        dtype.uuid,
                        '',
                        dtype.deviceUrl,
                        rinfo
                    );

                    this._sendResponse(
                        localIp,
                        dtype.uuid,
                        `urn:schemas-upnp-org:device:${dtype.type}:1`,
                        dtype.deviceUrl,
                        rinfo
                    );
                }
            } else if (this._deviceTypes.has(st)) {
                const dtype = this._deviceTypes.get(st);

                if (dtype !== undefined) {
                    this._sendResponse(
                        localIp,
                        dtype.uuid,
                        `urn:schemas-upnp-org:device:${dtype.type}:1`,
                        dtype.deviceUrl,
                        rinfo
                    );
                }
            }
        } else {
            Logger.getLogger().silly(`SsdpServer::onMessage: unknown message: ${message}`);
        }
    }

    private _geResponseHead(): string[] {
        return [
            'HTTP/1.1 200 OK',
            'CACHE-CONTROL: max-age=1800',
            `DATE: ${new Date().toUTCString()}`,
            'EXT:',
            'SERVER: UPnP/1.1 PuppeteerCast/1.0 DLNADOC/1.51',
        ];
    }

    /**
     * Build response
     * @param {string} localIp
     * @param {string} urn
     * @param {string} deviceUrl
     * @private
     */
    private _buildResponse(localIp: string, uuid: string, urn: string, deviceUrl: string): string {
        return [
            ...this._geResponseHead(),
            `LOCATION: http://${localIp}:${this._portHttpLocation}/${deviceUrl}`,
            `ST: ${urn === '' ? `uuid:${uuid}` : urn }`,
            `USN: ${urn === '' ? `uuid:${uuid}` : `uuid:${uuid}::${urn}` }`,
            '',
            ''
        ].join('\r\n');
    }

    private _sendResponse(localIp: string, uuid: string, urn: string, deviceUrl: string, rinfo: dgram.RemoteInfo): void {
        const response = Buffer.from(
            this._buildResponse(localIp, uuid, urn, deviceUrl)
        );

        this._server.send(
            response,
            0,
            response.length,
            rinfo.port,
            rinfo.address
        );

        Logger.getLogger().info(`SsdpServer::onMessage: Sent SSDP response to ${rinfo.address}:${rinfo.port} with LOCATION http://${localIp}:${this._portHttpLocation}/${deviceUrl}`);
    }

    private _buildNotify(localIp: string, uuid: string, urn: string, deviceUrl: string): string {
        return [
            'NOTIFY * HTTP/1.1',
            `HOST: 239.255.255.250:${this._portListen}`,
            'CACHE-CONTROL: max-age=1800',
            `LOCATION: http://${localIp}:${this._portHttpLocation}/${deviceUrl}`,
            `NT: ${urn === '' ? `uuid:${uuid}` : urn }`,
            'NTS: ssdp:alive',
            'SERVER: UPnP/1.1 PuppeteerCast/1.0 DLNADOC/1.51',
            `USN: ${urn === '' ? `uuid:${uuid}` : `uuid:${uuid}::${urn}` }`,
            '',
            ''
        ].join('\r\n');
    }

    private _sendNotify(localIp: string, uuid: string, urn: string, deviceUrl: string): void {
        const notify = Buffer.from(
            this._buildNotify(localIp, uuid, urn, deviceUrl)
        );

        this._server.send(notify, 1900, '239.255.255.250');
    }

}