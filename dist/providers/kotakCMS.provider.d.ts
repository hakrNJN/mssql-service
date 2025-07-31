import { Vwkotakcmsonline } from "../entity/anushreeDb/kotakCMS.entity";
import { AppDataSource } from "./data-source.provider";
export interface KotakCMSProvider {
    trimWhitespace<T>(obj: T): T;
    getKotakCMSData(fromVno: number, toVno: number, conum: string, yearid: number, offset?: number, limit?: number): Promise<Vwkotakcmsonline[]>;
    getById(id: number): Promise<Vwkotakcmsonline | null>;
}
export declare class KotakCMSProvider implements KotakCMSProvider {
    private kotakCMSRepository;
    private serMstRepository;
    private dataSourceInstance;
    private readonly logger;
    constructor(dataSourceInstance: AppDataSource);
    private _getKotakCMSRepository;
    private _getSerMstRepository;
    initializeRepository(): Promise<void>;
}
