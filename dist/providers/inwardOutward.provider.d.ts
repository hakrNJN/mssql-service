import { SpTblFinishInWardOutWard } from "../entity/anushreeDb/spTblFinishInWardOutWard.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { AppDataSource } from "./data-source.provider";
export interface InWardOutWardProvider extends BaseProviderInterface<SpTblFinishInWardOutWard, Filters<SpTblFinishInWardOutWard>> {
    trimWhitespace<T>(obj: T): T;
    getEntriesByFilter(conum: string, fdat: string, // YYYYMMDD format
    tdat: string, // YYYYMMDD format
    accountId: string, filters?: Filters<SpTblFinishInWardOutWard>, offset?: number, limit?: number): Promise<any[]>;
    getEntryByIdFromSPData(conum: string, fdat: string, tdat: string, accountId: string, purtrnId: number, // Assuming this is the unique identifier in the SP's output
    type: number): Promise<SpTblFinishInWardOutWard | null>;
}
export declare class InWardOutWardProvider implements InWardOutWardProvider {
    private inwardOutwardRepository;
    private dataSourceInstance;
    private readonly logger;
    constructor(dataSourceInstance: AppDataSource);
    private _getRepository;
    initializeRepository(): Promise<void>;
    private _executePurchaseInwardOutwardSp;
    getAll(offset?: number, limit?: number): Promise<SpTblFinishInWardOutWard[]>;
    getById(id: number): Promise<SpTblFinishInWardOutWard | null>;
    create(data: Partial<SpTblFinishInWardOutWard>): Promise<SpTblFinishInWardOutWard>;
    update(id: number, data: Partial<SpTblFinishInWardOutWard>): Promise<SpTblFinishInWardOutWard | null>;
    delete(id: number): Promise<boolean>;
}
