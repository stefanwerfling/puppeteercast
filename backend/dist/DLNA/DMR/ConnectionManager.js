import { DefaultRoute, Logger } from 'figtree';
export class ConnectionManager extends DefaultRoute {
    static _createDescXml() {
        return [
            '<?xml version="1.0"?>\n' +
                '<scpd xmlns="urn:schemas-upnp-org:service-1-0">\n' +
                '  <specVersion>\n' +
                '    <major>1</major>\n' +
                '    <minor>0</minor>\n' +
                '  </specVersion>\n' +
                '  <actionList>\n' +
                '    <action>\n' +
                '      <name>GetProtocolInfo</name>\n' +
                '      <argumentList>\n' +
                '        <argument>\n' +
                '          <name>Source</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>SourceProtocolInfo</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>Sink</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>SinkProtocolInfo</relatedStateVariable>\n' +
                '        </argument>\n' +
                '      </argumentList>\n' +
                '    </action>\n' +
                '    <action>\n' +
                '      <name>PrepareForConnection</name>\n' +
                '      <argumentList>\n' +
                '        <argument>\n' +
                '          <name>RemoteProtocolInfo</name>\n' +
                '          <direction>in</direction>\n' +
                '          <relatedStateVariable>ProtocolInfo</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>PeerConnectionManager</name>\n' +
                '          <direction>in</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_ConnectionManager</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>PeerConnectionID</name>\n' +
                '          <direction>in</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_ConnectionID</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>Direction</name>\n' +
                '          <direction>in</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_Direction</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>ConnectionID</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_ConnectionID</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>AVTransportID</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_AVTransportID</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>RcsID</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_RcsID</relatedStateVariable>\n' +
                '        </argument>\n' +
                '      </argumentList>\n' +
                '    </action>\n' +
                '    <action>\n' +
                '      <name>ConnectionComplete</name>\n' +
                '      <argumentList>\n' +
                '        <argument>\n' +
                '          <name>ConnectionID</name>\n' +
                '          <direction>in</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_ConnectionID</relatedStateVariable>\n' +
                '        </argument>\n' +
                '      </argumentList>\n' +
                '    </action>\n' +
                '    <action>\n' +
                '      <name>GetCurrentConnectionIDs</name>\n' +
                '      <argumentList>\n' +
                '        <argument>\n' +
                '          <name>ConnectionIDs</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>CurrentConnectionIDs</relatedStateVariable>\n' +
                '        </argument>\n' +
                '      </argumentList>\n' +
                '    </action>\n' +
                '    <action>\n' +
                '      <name>GetCurrentConnectionInfo</name>\n' +
                '      <argumentList>\n' +
                '        <argument>\n' +
                '          <name>ConnectionID</name>\n' +
                '          <direction>in</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_ConnectionID</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>RcsID</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_RcsID</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>AVTransportID</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_AVTransportID</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>ProtocolInfo</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>ProtocolInfo</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>PeerConnectionManager</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_ConnectionManager</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>PeerConnectionID</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_ConnectionID</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>Direction</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>A_ARG_TYPE_Direction</relatedStateVariable>\n' +
                '        </argument>\n' +
                '        <argument>\n' +
                '          <name>Status</name>\n' +
                '          <direction>out</direction>\n' +
                '          <relatedStateVariable>ConnectionStatus</relatedStateVariable>\n' +
                '        </argument>\n' +
                '      </argumentList>\n' +
                '    </action>\n' +
                '  </actionList>\n' +
                '  <serviceStateTable>\n' +
                '    <stateVariable sendEvents="no">\n' +
                '      <name>SourceProtocolInfo</name>\n' +
                '      <dataType>string</dataType>\n' +
                '    </stateVariable>\n' +
                '    <stateVariable sendEvents="no">\n' +
                '      <name>SinkProtocolInfo</name>\n' +
                '      <dataType>string</dataType>\n' +
                '    </stateVariable>\n' +
                '    <stateVariable sendEvents="no">\n' +
                '      <name>ProtocolInfo</name>\n' +
                '      <dataType>string</dataType>\n' +
                '    </stateVariable>\n' +
                '    <stateVariable sendEvents="no">\n' +
                '      <name>A_ARG_TYPE_ConnectionManager</name>\n' +
                '      <dataType>string</dataType>\n' +
                '    </stateVariable>\n' +
                '    <stateVariable sendEvents="no">\n' +
                '      <name>A_ARG_TYPE_ConnectionID</name>\n' +
                '      <dataType>i4</dataType>\n' +
                '    </stateVariable>\n' +
                '    <stateVariable sendEvents="no">\n' +
                '      <name>A_ARG_TYPE_Direction</name>\n' +
                '      <dataType>string</dataType>\n' +
                '      <allowedValueList>\n' +
                '        <allowedValue>Input</allowedValue>\n' +
                '        <allowedValue>Output</allowedValue>\n' +
                '      </allowedValueList>\n' +
                '    </stateVariable>\n' +
                '    <stateVariable sendEvents="no">\n' +
                '      <name>A_ARG_TYPE_AVTransportID</name>\n' +
                '      <dataType>i4</dataType>\n' +
                '    </stateVariable>\n' +
                '    <stateVariable sendEvents="no">\n' +
                '      <name>A_ARG_TYPE_RcsID</name>\n' +
                '      <dataType>i4</dataType>\n' +
                '    </stateVariable>\n' +
                '    <stateVariable sendEvents="no">\n' +
                '      <name>CurrentConnectionIDs</name>\n' +
                '      <dataType>string</dataType>\n' +
                '    </stateVariable>\n' +
                '    <stateVariable sendEvents="no">\n' +
                '      <name>ConnectionStatus</name>\n' +
                '      <dataType>string</dataType>\n' +
                '      <allowedValueList>\n' +
                '        <allowedValue>OK</allowedValue>\n' +
                '        <allowedValue>ContentFormatMismatch</allowedValue>\n' +
                '        <allowedValue>InsufficientBandwidth</allowedValue>\n' +
                '        <allowedValue>UnreliableChannel</allowedValue>\n' +
                '        <allowedValue>Unknown</allowedValue>\n' +
                '      </allowedValueList>\n' +
                '    </stateVariable>\n' +
                '  </serviceStateTable>\n' +
                '</scpd>'
        ];
    }
    async _soapGetCurrentConnectionIDs(request, response) {
        Logger.getLogger().silly('Called: /dmr/ConnectionManager/control::GetCurrentConnectionIDs');
        response.set('Content-Type', 'text/xml; charset="utf-8"');
        response.status(200).send(`<?xml version="1.0"?>
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
                  s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
          <u:GetCurrentConnectionIDsResponse xmlns:u="urn:schemas-upnp-org:service:ConnectionManager:1">
            <ConnectionIDs>0</ConnectionIDs>
          </u:GetCurrentConnectionIDsResponse>
        </s:Body>
      </s:Envelope>`);
    }
    async _soapGetCurrentConnectionInfo(request, response) {
        Logger.getLogger().silly('Called: /dmr/ConnectionManager/control::GetCurrentConnectionInfo');
        response.set('Content-Type', 'text/xml; charset="utf-8"');
        response.status(200).send(`<?xml version="1.0"?>
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
                  s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
          <u:GetCurrentConnectionInfoResponse xmlns:u="urn:schemas-upnp-org:service:ConnectionManager:1">
            <RcsID>0</RcsID>
            <AVTransportID>0</AVTransportID>
            <ProtocolInfo>http-get:*:video/mpeg:*</ProtocolInfo>
            <PeerConnectionManager></PeerConnectionManager>
            <PeerConnectionID>-1</PeerConnectionID>
            <Direction>Input</Direction>
            <Status>OK</Status>
          </u:GetCurrentConnectionInfoResponse>
        </s:Body>
      </s:Envelope>`);
    }
    async _soapGetProtocolInfo(request, response) {
        Logger.getLogger().silly('Called: /dmr/ConnectionManager/control::GetProtocolInfo');
        response.set('Content-Type', 'text/xml; charset="utf-8"');
        response.status(200).send(`<?xml version="1.0"?>
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
                  s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
          <u:GetProtocolInfoResponse xmlns:u="urn:schemas-upnp-org:service:ConnectionManager:1">
            <Source>http-get:*:video/mpeg:*</Source>
            <Sink>http-get:*:video/mpeg:*</Sink>
          </u:GetProtocolInfoResponse>
        </s:Body>
      </s:Envelope>`);
    }
    getExpressRouter() {
        this._get('/dmr/ConnectionManager/desc.xml', false, async (request, response) => {
            response.set('Content-Type', 'text/xml');
            response.send(ConnectionManager._createDescXml().join());
        }, {
            description: 'DLNA Media Render - ConnectionManager desc.xml'
        });
        this._post('/dmr/ConnectionManager/control', false, async (request, response) => {
            const xml = request.rawHeaders.join('\r\n');
            console.log(xml);
            switch (true) {
                case xml.includes('GetProtocolInfo'):
                    await this._soapGetProtocolInfo(request, response);
                    break;
                case xml.includes('GetCurrentConnectionIDs'):
                    await this._soapGetCurrentConnectionIDs(request, response);
                    break;
                case xml.includes('GetCurrentConnectionInfo'):
                    await this._soapGetCurrentConnectionInfo(request, response);
                    break;
                default:
                    Logger.getLogger().error('Called: /dmr/ConnectionManager/control - Unsupported SOAP Action');
                    response.status(500).send('Unsupported SOAP Action');
            }
        }, {
            description: 'DLNA Media Render - ConnectionManager control'
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=ConnectionManager.js.map