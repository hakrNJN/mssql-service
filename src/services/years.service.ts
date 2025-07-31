//src/services/years.service.ts

import { YearMst } from "../entity/anushreeDb/years.entity";
import { AppDataSource } from "../providers/data-source.provider";
import { YearsProvider } from "../providers/years.provider";
import { Filters } from "../types/filter.types";

export class YearService {
    private yearsProvider: YearsProvider;
    // private dataSourceInstance: AppDataSource; // Add dataSourceInstance in YearService

    constructor(private dataSourceInstance: AppDataSource) {
        // Create an instance of AppDataSource
        /* The line `this.dataSourceInstance = new AppDataSource();` in the YearService constructor is creating a new instance of the AppDataSource class and assigning it to the dataSourceInstance property of the YearService class. This allows the YearService to have access to an instance of the data source provider, which can be used to interact with the data source and perform operations such as initializing the data source or fetching data. */
        // this.dataSourceInstance = new AppDataSource();
        // Pass the instance to YearsProvider
        this.yearsProvider = new YearsProvider(this.dataSourceInstance); // Pass dataSourceInstance
    }

    async initialize(): Promise<void> {
        await this.yearsProvider.initializeRepository();
        // await this.dataSourceInstance.init(); // Initialize dataSource in service as well if needed
    }

    async getYearsWithFilters(filters?: Filters<YearMst>): Promise<YearMst[]> {
        return this.yearsProvider.getAllYearsWithFilters(filters);
    }

    async getYearsById(id: number): Promise<YearMst | null> {
        return this.yearsProvider.getYearById(id);
    }

    async getYears(): Promise<YearMst[] | null> {
        return this.yearsProvider.getAllYears();
    }
}