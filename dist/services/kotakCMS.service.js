"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KotakCMSService = void 0;
const kotakCMS_provider_1 = require("../providers/kotakCMS.provider");
// import { Filters } from "../types/filter.types"; // No longer directly used in service method signature
class KotakCMSService {
    constructor(dataSourceInstance) {
        this.dataSourceInstance = dataSourceInstance;
        this.kotakCMSProvider = new kotakCMS_provider_1.KotakCMSProvider(this.dataSourceInstance);
    }
    async initialize() {
        await this.kotakCMSProvider.initializeRepository();
    }
    // This method is now responsible for the complex query and its specific parameters
    async getKotakCMSData(// Renamed from getKotakCMSWithFilters to match provider method
    fromVno, toVno, conum, yearid, offset, limit) {
        return this.kotakCMSProvider.getKotakCMSData(fromVno, toVno, conum, yearid, offset, limit);
    }
}
exports.KotakCMSService = KotakCMSService;
