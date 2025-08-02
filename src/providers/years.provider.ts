// src/providers/year.provider.ts
import { inject, injectable } from "tsyringe";
import { Repository } from "typeorm";
import { YearMst } from "../entity/anushreeDb/years.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { ILogger } from "../interface/logger.interface";
import { Filters } from "../types/filter.types";
import { WINSTON_LOGGER } from "../utils/logger";
import { applyFilters } from "../utils/query-utils";
import { AppDataSource } from "./data-source.provider";

export interface YearsProvider extends BaseProviderInterface<YearMst, Filters<YearMst>> { }

@injectable()
export class YearsProvider implements YearsProvider { // Export the class
    private yearRepository: Repository<YearMst> | null = null;
    private dataSourceInstance: AppDataSource; // Hold an instance of AppDataSource
    private readonly logger: ILogger;

    constructor(@inject(AppDataSource) dataSourceInstance: AppDataSource, @inject(WINSTON_LOGGER) logger: ILogger) { // Inject AppDataSource and ILogger in constructor
        this.dataSourceInstance = dataSourceInstance;
        this.logger = logger;
    }

    private _getRepository(): Repository<YearMst> {
        if (!this.yearRepository) {
            throw new Error("Year repository not initialized. Call initializeRepository() first.");
        }
        return this.yearRepository;
    }

    async initializeRepository(): Promise<void> { // Initialize the repository
        const dataSource = this.dataSourceInstance.getDataSource(); // Ensure DataSource is initialized
        this.yearRepository = dataSource.getRepository(YearMst);
    }

    async getAllYearsWithFilters(filters?: Filters<YearMst>): Promise<YearMst[]> {
        const queryBuilder = this._getRepository().createQueryBuilder('years');
        const filteredQueryBuilder = applyFilters(queryBuilder, filters, 'years'); // Call the imported utility function
        const years = await filteredQueryBuilder.getMany();
        return years;
    }

    async getAllYears(): Promise<YearMst[]> {
        try {
            return await this._getRepository().find();
        } catch (error) {
            throw new Error(error as string)
        }
    }

    async getYearById(id: number): Promise<YearMst | null> {
        return await this._getRepository().findOneBy({ id });
    }

    // Additional CRUD Methods
    // async createYear(yearData: Partial<YearMst>): Promise<YearMst> {
    //     const year = this._getRepository().create(yearData);
    //     return this._getRepository().save(year);
    // }

    // async updateYear(id: number, yearData: Partial<YearMst>): Promise<YearMst | null> {
    //     await this._getRepository().update(id, yearData);
    //     return this.getYearById(id); // Return the updated year
    // }

    // async deleteYear(id: number): Promise<boolean> {
    //     const deleteResult = await this._getRepository().delete(id);
    //     return (deleteResult.affected ?? 0) > 0;; // Return true if deletion was successful
    // }
}