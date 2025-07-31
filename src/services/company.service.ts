//src/services/company.service.ts


import { CompMst } from "../entity/anushreeDb/company.entity";
import { CompanyProvider } from "../providers/company.provider";
import { AppDataSource } from "../providers/data-source.provider";
import { Filters } from "../types/filter.types";

export class CompanyService {
    private companyProvider: CompanyProvider;

    constructor(private dataSourceInstance: AppDataSource) {
        this.companyProvider = new CompanyProvider(this.dataSourceInstance);
    }

    async initialize(): Promise<void> {
        await this.companyProvider.initializeRepository();
    }

    async getCompaniesWithFilters(filters?: Filters<CompMst>): Promise<CompMst[]> {
        return this.companyProvider.getAllCompaniesWithFilters(filters);
    }

    async getCompanyById(id: number): Promise<CompMst | null> {
        return this.companyProvider.getCompanyById(id);
    }

    async getCompanies(): Promise<CompMst[] | null> {
        return this.companyProvider.getAllCompanies();
    }
}