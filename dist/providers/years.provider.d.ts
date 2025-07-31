import { YearMst } from "../entity/anushreeDb/years.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { AppDataSource } from "./data-source.provider";
export interface YearsProvider extends BaseProviderInterface<YearMst, Filters<YearMst>> {
}
export declare class YearsProvider implements YearsProvider {
    private yearRepository;
    private dataSourceInstance;
    constructor(dataSourceInstance: AppDataSource);
    private _getRepository;
    initializeRepository(): Promise<void>;
    getAllYearsWithFilters(filters?: Filters<YearMst>): Promise<YearMst[]>;
    getAllYears(): Promise<YearMst[]>;
    getYearById(id: number): Promise<YearMst | null>;
}
