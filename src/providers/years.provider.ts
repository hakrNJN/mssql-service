// src/providers/year.provider.ts
import { Repository } from "typeorm";
import { YearMst } from "../entity/anushreeDb/years.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { ILogger } from "../interface/logger.interface";
import { Filters } from "../types/filter.types";
import { applyFilters } from "../utils/query-utils";
import { DataSource } from "typeorm";

export interface YearsProvider extends BaseProviderInterface<YearMst, Filters<YearMst>> { }

export class YearsProvider implements YearsProvider { // Export the class
    private yearRepository: Repository<YearMst> | null = null;
    private readonly logger: ILogger;
    private readonly mainDataSource: DataSource;

    constructor(
        mainDataSource: DataSource,
        logger: ILogger
    ) {
        this.mainDataSource = mainDataSource;
        this.logger = logger;
        
    }

    private _getRepository(): Repository<YearMst> {
        if (!this.yearRepository) {
            this.yearRepository = this.mainDataSource.getRepository(YearMst);
            this.logger.info("YearsProvider repository initialized lazily.");
        }
        return this.yearRepository;
    }

    public initializeRepository(): void {
        // This method is no longer needed as repository is initialized lazily.
        // Keeping it for now to avoid breaking interface contracts if any.
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