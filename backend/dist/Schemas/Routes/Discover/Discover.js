import { Vts } from 'vts';
export const SchemaDiscoverResponse = Vts.object({
    FriendlyName: Vts.string(),
    Manufacturer: Vts.string(),
    DeviceAuth: Vts.string(),
    DeviceID: Vts.string(),
    FirmwareName: Vts.string(),
    FirmwareVersion: Vts.string(),
    ModelNumber: Vts.string(),
    TunerCount: Vts.number(),
    DeviceType: Vts.string(),
    BaseURL: Vts.string(),
    LineupURL: Vts.optional(Vts.string())
});
//# sourceMappingURL=Discover.js.map