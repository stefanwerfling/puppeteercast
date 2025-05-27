import {ExtractSchemaResultType, Vts} from 'vts';

export const SchemaLineupStatusResponse = Vts.object({
    ScanInProgress: Vts.number(),
    ScanPossible: Vts.number(),
    Source: Vts.string(),
    SourceList: Vts.array(Vts.string()),
    Lineup: Vts.optional(Vts.string()),
    Status: Vts.optional(Vts.string())
});

export type LineupStatusResponse = ExtractSchemaResultType<typeof SchemaLineupStatusResponse>;