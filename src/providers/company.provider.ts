// src/providers/year.provider.ts
import { inject, injectable } from "tsyringe";
import { Repository } from "typeorm";
import { CompMst } from "../entity/anushreeDb/company.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { ILogger } from "../interface/logger.interface";
import { Filters } from "../types/filter.types";
import { WINSTON_LOGGER } from "../utils/logger";
import { applyFilters } from "../utils/query-utils";
import { DataSource } from "typeorm";
import { MAIN_DATA_SOURCE } from "../services/dataSourceManager.service";

export interface CompanyProvider extends BaseProviderInterface<CompMst, Filters<CompMst>> { }

@injectable()
export class CompanyProvider implements CompanyProvider {
    private companyRepository: Repository<CompMst> | null = null;
    private readonly logger: ILogger;
    private readonly mainDataSource: DataSource;

    constructor(
        @inject(MAIN_DATA_SOURCE) mainDataSource: DataSource,
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.mainDataSource = mainDataSource;
        this.logger = logger;
    }

    private _getRepository(): Repository<CompMst> {
        if (!this.companyRepository) {
            this.companyRepository = this.mainDataSource.getRepository(CompMst);
            this.logger.info("CompanyProvider repository initialized lazily.");
        }
        return this.companyRepository;
    }

    public initializeRepository(): void {
        // This method is no longer needed as repository is initialized lazily.
        // Keeping it for now to avoid breaking interface contracts if any.
    }

    async getAllCompaniesWithFilters(filters?: Filters<CompMst>): Promise<CompMst[]> {
        try {
            const queryBuilder = this._getRepository().createQueryBuilder('company');
            const filteredQueryBuilder = applyFilters(queryBuilder, filters, 'company'); // Call the imported utility function
            const company = await filteredQueryBuilder.getMany();
            return company;
        } catch (error) {
            this.logger.error("Error fetching All Companies with Filter", error);
            throw new Error(error as string)
        }
    }

    async getAllCompanies(): Promise<CompMst[]> {
        try {
            return await this._getRepository().find();
        } catch (error) {
            this.logger.error("Error fetching All Companies", error);
            throw new Error(error as string)
        }
    }

    async getCompanyById(id: number): Promise<CompMst | null> {
        return await this._getRepository().findOneBy({ id });
    }

    // Additional CRUD Methods
    // async createCompany(companyData: Partial<CompMst>): Promise<CompMst> {
    //     const company = this._getRepository().create(companyData);
    //     return this._getRepository().save(company);
    // }

    // async updateCompany(id: number, companyData: Partial<CompMst>): Promise<CompMst | null> {
    //     await this._getRepository().update(id, companyData);
    //     return this.getCompanyById(id); // Return the updated company
    // }

    // async deleteCompany(id: number): Promise<boolean> {
    //     const deleteResult = await this._getRepository().delete(id);
    //     return (deleteResult.affected ?? 0) > 0;; // Return true if deletion was successful
    // }
}