//src/services/company.service.ts


import { inject, injectable } from 'tsyringe';
import { CompMst } from "../entity/anushreeDb/company.entity";
import { CompanyProvider } from "../providers/company.provider";
import { DataSourceManager } from "./dataSourceManager.service";
import { ILogger } from "../interface/logger.interface";
import { WINSTON_LOGGER } from "../utils/logger";

import { Filters } from "../types/filter.types";

@injectable()
export class CompanyService {
    private companyProvider: CompanyProvider;

    constructor(
        @inject(DataSourceManager) dataSourceManager: DataSourceManager,
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.companyProvider = new CompanyProvider(dataSourceManager.mainDataSource, logger);
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