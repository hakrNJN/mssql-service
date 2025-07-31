import { CompMst } from "../entity/anushreeDb/company.entity";
import { AppDataSource } from "../providers/data-source.provider";
import { Filters } from "../types/filter.types";
export declare class CompanyService {
    private dataSourceInstance;
    private companyProvider;
    constructor(dataSourceInstance: AppDataSource);
    initialize(): Promise<void>;
    getCompaniesWithFilters(filters?: Filters<CompMst>): Promise<CompMst[]>;
    getCompanyById(id: number): Promise<CompMst | null>;
    getCompanies(): Promise<CompMst[] | null>;
}
