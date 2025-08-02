//src/services/years.service.ts

import { inject, injectable } from "tsyringe";
import { YearMst } from "../entity/anushreeDb/years.entity";
import { YearsProvider } from "../providers/years.provider";
import { Filters } from "../types/filter.types";

@injectable()
export class YearService {
    private yearsProvider: YearsProvider;

    constructor(
        @inject(YearsProvider) yearsProvider: YearsProvider
    ) {
        this.yearsProvider = yearsProvider;
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