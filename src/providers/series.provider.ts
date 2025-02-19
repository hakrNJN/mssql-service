// src/providers/year.provider.ts
import { Repository } from "typeorm";
import { SerMst } from "../entity/anushree/series.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { applyFilters } from "../utils/query-utils";
import { AppDataSource } from "./data-source.provider";

export interface SeriesProvider extends BaseProviderInterface<SerMst, Filters<SerMst>> {} 
export class SeriesProvider implements SeriesProvider { 
    private seriesRepository: Repository<SerMst> | null = null;;
    private dataSourceInstance: AppDataSource; 

    constructor(dataSourceInstance: AppDataSource) { // Inject AppDataSource in constructor
        this.dataSourceInstance = dataSourceInstance;
    }

    private _getRepository(): Repository<SerMst> {
        if (!this.seriesRepository) {
            throw new Error("Year repository not initialized. Call initializeRepository() first.");
        }
        return this.seriesRepository;
    }
    
    async initializeRepository(): Promise<void> { // Initialize the repository
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.seriesRepository = dataSource.getRepository(SerMst);
    }

    async getAllSeriesWithFilters(filters?: Filters<SerMst>): Promise<SerMst[]> {
        const queryBuilder = this._getRepository().createQueryBuilder('series');
        const filteredQueryBuilder = applyFilters(queryBuilder, filters, 'series'); // Call the imported utility function
        const series = await filteredQueryBuilder.getMany();
        return series;
    }

    async getAllSeries(): Promise<SerMst[]> {
        try {
            return this._getRepository().find();
        } catch (error) {
            throw new Error(error as string)
        }
    }

    async getSeriesById(id: number): Promise<SerMst | null> {
        return this._getRepository().findOneBy({ id });
    }

    // Additional CRUD Methods
    // async createSeries(seriesData: Partial<SerMst>): Promise<SerMst> {
    //     const series = this._getRepository().create(seriesData);
    //     return this._getRepository().save(series);
    // }

    // async updateSeries(id: number, seriesData: Partial<SerMst>): Promise<SerMst | null> {
    //     await this._getRepository().update(id, seriesData);
    //     return this.getSeriesById(id); // Return the updated series
    // }

    // async deleteSeries(id: number): Promise<boolean> {
    //     const deleteResult = await this._getRepository().delete(id);
    //     return (deleteResult.affected ?? 0) > 0;; // Return true if deletion was successful
    // }
}