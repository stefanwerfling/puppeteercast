import { Vts } from 'vts';
export const SchemaLineupStatusResponse = Vts.object({
    ScanInProgress: Vts.number(),
    ScanPossible: Vts.number(),
    Source: Vts.string(),
    SourceList: Vts.array(Vts.string()),
    Lineup: Vts.optional(Vts.string()),
    Status: Vts.optional(Vts.string())
});
//# sourceMappingURL=LineupStatus.js.map