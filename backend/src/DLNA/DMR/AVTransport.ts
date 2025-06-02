import {Router} from 'express';
import {DefaultRoute} from 'figtree';

export class AVTransport extends DefaultRoute {

    protected static _createDescXml(): string[] {
        return [
            '<?xml version="1.0"?>\n' +
            '<scpd xmlns="urn:schemas-upnp-org:service-1-0">\n' +
            '  <specVersion>\n' +
            '    <major>1</major>\n' +
            '    <minor>0</minor>\n' +
            '  </specVersion>\n' +
            '  <actionList>\n' +
            '    <action>\n' +
            '      <name>SetAVTransportURI</name>\n' +
            '      <argumentList>\n' +
            '        <argument>\n' +
            '          <name>InstanceID</name>\n' +
            '          <direction>in</direction>\n' +
            '          <relatedStateVariable>A_ARG_TYPE_InstanceID</relatedStateVariable>\n' +
            '        </argument>\n' +
            '        <argument>\n' +
            '          <name>CurrentURI</name>\n' +
            '          <direction>in</direction>\n' +
            '          <relatedStateVariable>AVTransportURI</relatedStateVariable>\n' +
            '        </argument>\n' +
            '        <argument>\n' +
            '          <name>CurrentURIMetaData</name>\n' +
            '          <direction>in</direction>\n' +
            '          <relatedStateVariable>AVTransportURIMetaData</relatedStateVariable>\n' +
            '        </argument>\n' +
            '      </argumentList>\n' +
            '    </action>\n' +
            '    <action>\n' +
            '      <name>Play</name>\n' +
            '      <argumentList>\n' +
            '        <argument>\n' +
            '          <name>InstanceID</name>\n' +
            '          <direction>in</direction>\n' +
            '          <relatedStateVariable>A_ARG_TYPE_InstanceID</relatedStateVariable>\n' +
            '        </argument>\n' +
            '        <argument>\n' +
            '          <name>Speed</name>\n' +
            '          <direction>in</direction>\n' +
            '          <relatedStateVariable>TransportPlaySpeed</relatedStateVariable>\n' +
            '        </argument>\n' +
            '      </argumentList>\n' +
            '    </action>\n' +
            '  </actionList>\n' +
            '  <serviceStateTable>\n' +
            '    <stateVariable sendEvents="no">\n' +
            '      <name>A_ARG_TYPE_InstanceID</name>\n' +
            '      <dataType>ui4</dataType>\n' +
            '    </stateVariable>\n' +
            '    <stateVariable sendEvents="no">\n' +
            '      <name>AVTransportURI</name>\n' +
            '      <dataType>string</dataType>\n' +
            '    </stateVariable>\n' +
            '    <stateVariable sendEvents="no">\n' +
            '      <name>AVTransportURIMetaData</name>\n' +
            '      <dataType>string</dataType>\n' +
            '    </stateVariable>\n' +
            '    <stateVariable sendEvents="no">\n' +
            '      <name>TransportPlaySpeed</name>\n' +
            '      <dataType>string</dataType>\n' +
            '      <allowedValueList>\n' +
            '        <allowedValue>1</allowedValue>\n' +
            '      </allowedValueList>\n' +
            '    </stateVariable>\n' +
            '  </serviceStateTable>\n' +
            '</scpd>'
        ];
    }

    public getExpressRouter(): Router {
        this._get(
            '/dmr/AVTransport/desc.xml',
            false,
            async(request, response): Promise<void> => {
                response.set('Content-Type', 'text/xml');
                response.send(AVTransport._createDescXml().join());
            },
            {
                description: 'DLNA Media Render - AVTransport desc.xml'
            }
        );

        this._post(
            '/dmr/AVTransport/control',
            false,
            async(request, response): Promise<void> => {
                response.set('Content-Type', 'text/xml; charset="utf-8"');
                response.send(`
    <?xml version="1.0"?>
    <s:Envelope
      xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
      s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <s:Body>
        <u:SetAVTransportURIResponse xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">
        </u:SetAVTransportURIResponse>
      </s:Body>
    </s:Envelope>
  `);
            },
            {
                description: 'DLNA Media Render - AVTransport control'
            }
        );

        return super.getExpressRouter();
    }

}