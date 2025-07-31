import { CompMst } from "../entity/anushreeDb/company.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { AppDataSource } from "./data-source.provider";
export interface CompanyProvider extends BaseProviderInterface<CompMst, Filters<CompMst>> {
}
export declare class CompanyProvider implements CompanyProvider {
    private yearRepository;
    private dataSourceInstance;
    constructor(dataSourceInstance: AppDataSource);
    private _getRepository;
    initializeRepository(): Promise<void>;
    getAllCompaniesWithFilters(filters?: Filters<CompMst>): Promise<CompMst[]>;
    getAllCompanies(): Promise<CompMst[]>;
    getCompanyById(id: number): Promise<CompMst | null>;
}
