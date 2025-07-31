"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesProvider = void 0;
const series_entity_1 = require("../entity/anushreeDb/series.entity");
const query_utils_1 = require("../utils/query-utils");
class SeriesProvider {
    ;
    // private readonly logger: ILogger;
    constructor(dataSourceInstance) {
        this.seriesRepository = null;
        this.dataSourceInstance = dataSourceInstance;
        //  this.logger = container.resolve<ILogger>(WINSTON_LOGGER);
    }
    _getRepository() {
        if (!this.seriesRepository) {
            throw new Error("Year repository not initialized. Call initializeRepository() first.");
        }
        return this.seriesRepository;
    }
    async initializeRepository() {
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.seriesRepository = dataSource.getRepository(series_entity_1.SerMst);
    }
    async getAllSeriesWithFilters(filters) {
        const queryBuilder = this._getRepository().createQueryBuilder('series');
        const filteredQueryBuilder = (0, query_utils_1.applyFilters)(queryBuilder, filters, 'series'); // Call the imported utility function
        const series = await filteredQueryBuilder.getMany();
        return series;
    }
    async getAllSeries() {
        try {
            return this._getRepository().find();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getSeriesById(id) {
        return this._getRepository().findOneBy({ id });
    }
}
exports.SeriesProvider = SeriesProvider;
