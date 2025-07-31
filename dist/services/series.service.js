"use strict";
//src/services/series.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesService = void 0;
const series_provider_1 = require("../providers/series.provider");
class SeriesService {
    constructor(dataSourceInstance) {
        this.dataSourceInstance = dataSourceInstance;
        this.seriesProvider = new series_provider_1.SeriesProvider(this.dataSourceInstance);
    }
    async initialize() {
        await this.seriesProvider.initializeRepository();
    }
    async getAllSeries() {
        return this.seriesProvider.getAllSeriesWithFilters();
    }
    async getSeriesbyId(id) {
        return this.seriesProvider.getSeriesById(id);
    }
    async getSeriesWithFilters(filters) {
        return this.seriesProvider.getAllSeriesWithFilters(filters);
    }
}
exports.SeriesService = SeriesService;
