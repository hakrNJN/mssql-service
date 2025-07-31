"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearsProvider = void 0;
const years_entity_1 = require("../entity/anushreeDb/years.entity");
const query_utils_1 = require("../utils/query-utils"); // Import AppDataSource
class YearsProvider {
    constructor(dataSourceInstance) {
        this.yearRepository = null;
        this.dataSourceInstance = dataSourceInstance;
    }
    _getRepository() {
        if (!this.yearRepository) {
            throw new Error("Year repository not initialized. Call initializeRepository() first.");
        }
        return this.yearRepository;
    }
    async initializeRepository() {
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.yearRepository = dataSource.getRepository(years_entity_1.YearMst);
    }
    async getAllYearsWithFilters(filters) {
        const queryBuilder = this._getRepository().createQueryBuilder('years');
        const filteredQueryBuilder = (0, query_utils_1.applyFilters)(queryBuilder, filters, 'years'); // Call the imported utility function
        const years = await filteredQueryBuilder.getMany();
        return years;
    }
    async getAllYears() {
        try {
            return this._getRepository().find();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getYearById(id) {
        return this._getRepository().findOneBy({ id });
    }
}
exports.YearsProvider = YearsProvider;
