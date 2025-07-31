import { YearMst } from "../entity/anushreeDb/years.entity";
import { AppDataSource } from "../providers/data-source.provider";
import { Filters } from "../types/filter.types";
export declare class YearService {
    private dataSourceInstance;
    private yearsProvider;
    constructor(dataSourceInstance: AppDataSource);
    initialize(): Promise<void>;
    getYearsWithFilters(filters?: Filters<YearMst>): Promise<YearMst[]>;
    getYearsById(id: number): Promise<YearMst | null>;
    getYears(): Promise<YearMst[] | null>;
}
