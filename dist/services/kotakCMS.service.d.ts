import { Vwkotakcmsonline } from "../entity/anushreeDb/kotakCMS.entity";
import { AppDataSource } from "../providers/data-source.provider";
export declare class KotakCMSService {
    private dataSourceInstance;
    private kotakCMSProvider;
    constructor(dataSourceInstance: AppDataSource);
    initialize(): Promise<void>;
    getKotakCMSData(// Renamed from getKotakCMSWithFilters to match provider method
    fromVno: number, toVno: number, conum: string, yearid: number, offset?: number, limit?: number): Promise<Vwkotakcmsonline[]>;
}
