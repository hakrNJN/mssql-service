// src/providers/year.provider.ts
import { Repository } from "typeorm";
import { CompMst } from "../entity/anushreeDb/company.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { applyFilters } from "../utils/query-utils";
import { AppDataSource } from "./data-source.provider";

export interface CompanyProvider extends BaseProviderInterface<CompMst, Filters<CompMst>> { }

export class CompanyProvider implements CompanyProvider {
    private companyRepository: Repository<CompMst> | null = null;;
    private dataSourceInstance: AppDataSource;


    constructor(dataSourceInstance: AppDataSource) { // Inject AppDataSource in constructor
        this.dataSourceInstance = dataSourceInstance;
    }

    private _getRepository(): Repository<CompMst> {
        if (!this.companyRepository) {
            throw new Error("Company repository not initialized. Call initializeRepository() first.");
        }
        return this.companyRepository;
    }

    async initializeRepository(): Promise<void> { // Initialize the repository
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.companyRepository = dataSource.getRepository(CompMst);
    }

    async getAllCompaniesWithFilters(filters?: Filters<CompMst>): Promise<CompMst[]> {
        const queryBuilder = this._getRepository().createQueryBuilder('company');
        const filteredQueryBuilder = applyFilters(queryBuilder, filters, 'company'); // Call the imported utility function
        const company = await filteredQueryBuilder.getMany();
        return company;
    }

    async getAllCompanies(): Promise<CompMst[]> {
        try {
            return await this._getRepository().find();
        } catch (error) {
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