// src/providers/year.provider.ts
import { Repository } from "typeorm";
import { YearMst } from "../entity/years.entity";
import { Filters } from "../types/filter.types";
import { applyFilters } from "../utils/query-utils"; // Import AppDataSource
import { AppDataSource } from "./data-source.provider";

export class YearsProvider { // Export the class
    private yearRepository: Repository<YearMst> | null = null;;
    private dataSourceInstance: AppDataSource; // Hold an instance of AppDataSource

    constructor(dataSourceInstance: AppDataSource) { // Inject AppDataSource in constructor
        this.dataSourceInstance = dataSourceInstance;
    }

    private _getRepository(): Repository<YearMst> {
        if (!this.yearRepository) {
            throw new Error("Year repository not initialized. Call initializeRepository() first.");
        }
        return this.yearRepository;
    }
    
    async initializeRepository(): Promise<void> { // Initialize the repository
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.yearRepository = dataSource.getRepository(YearMst);
    }

    async getAllYearsWithFilters(filters?: Filters<YearMst>): Promise<YearMst[]> {
        const queryBuilder = this._getRepository().createQueryBuilder('years');
        const filteredQueryBuilder = applyFilters(queryBuilder, filters, 'years'); // Call the imported utility function
        const years = await filteredQueryBuilder.getMany();
        return years;
    }
    // Example CRUD methods (add more as needed)
    async getAllYears(): Promise<YearMst[]> {
        try {
            return this._getRepository().find();
        } catch (error) {
            throw new Error(error as string)
        }
    }

    async getYearById(id: number): Promise<YearMst | null> {
        return this._getRepository().findOneBy({ id });
    }

    // Aditional CRUD Methods
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