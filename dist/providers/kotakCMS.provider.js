"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KotakCMSProvider = void 0;
//src/providers/KotakCMS.provider.ts
const tsyringe_1 = require("tsyringe");
const objectDecorators_1 = require("../decorators/objectDecorators");
const kotakCMS_entity_1 = require("../entity/anushreeDb/kotakCMS.entity");
const series_entity_1 = require("../entity/anushreeDb/series.entity");
// import { Filters } from "../types/filter.types"; // REMOVED: Not using generic filters directly here
const logger_1 = require("../utils/logger");
// Removed applyFilters as we're building a custom query
const data_source_provider_1 = require("./data-source.provider");
let KotakCMSProvider = class KotakCMSProvider {
    constructor(dataSourceInstance) {
        this.kotakCMSRepository = null;
        this.serMstRepository = null;
        this.dataSourceInstance = dataSourceInstance;
        this.logger = tsyringe_1.container.resolve(logger_1.WINSTON_LOGGER);
    }
    _getKotakCMSRepository() {
        if (!this.kotakCMSRepository) {
            throw new Error("Kotak CMS repository not initialized. Call initializeRepository() first.");
        }
        return this.kotakCMSRepository;
    }
    _getSerMstRepository() {
        if (!this.serMstRepository) {
            throw new Error("SerMst repository not initialized. Call initializeRepository() first.");
        }
        return this.serMstRepository;
    }
    async initializeRepository() {
        const dataSource = await this.dataSourceInstance.init();
        this.kotakCMSRepository = dataSource.getRepository(kotakCMS_entity_1.Vwkotakcmsonline);
        this.serMstRepository = dataSource.getRepository(series_entity_1.SerMst);
    }
    // Explicit implementation for getById if kept (from previously, not from BaseProviderInterface)
    async getById(id) {
        try {
            const record = await this._getKotakCMSRepository().findOne({ where: { vno: id } });
            return record ? this.trimWhitespace(record) : null;
        }
        catch (error) {
            this.logger.error(`Error fetching Kotak CMS by vno ${id}`, error);
            throw new Error(error);
        }
    }
    // This is the single, specific data retrieval method for Kotak CMS
    async getKotakCMSData(fromVno, toVno, conum, yearid, offset, limit) {
        try {
            const queryBuilder = this._getKotakCMSRepository().createQueryBuilder('vwkotak');
            // Add WHERE conditions for vno and conum
            queryBuilder
                .where('vwkotak.vno BETWEEN :fromVno AND :toVno', { fromVno, toVno })
                .andWhere('vwkotak.Conum = :conum', { conum });
            // Add the subquery for TYPE IN (...)
            const subQuery = this._getSerMstRepository().createQueryBuilder('serMst')
                .select('serMst.id')
                .where('serMst.Type = :serMstType', { serMstType: 'Payment' })
                .andWhere('serMst.Name NOT IN (:...excludedNames)', { excludedNames: ['Multi Payment', 'Cash Payment'] })
                .andWhere('serMst.YearId = :yearid', { yearid });
            queryBuilder.andWhere(`vwkotak.Type IN (${subQuery.getQuery()})`);
            queryBuilder.setParameters(subQuery.getParameters()); // Important: Set parameters from subquery
            // Apply pagination
            if (offset !== undefined) {
                queryBuilder.skip(offset);
            }
            if (limit !== undefined) {
                queryBuilder.take(limit);
            }
            // Order by vno
            queryBuilder.orderBy('vwkotak.vno', 'ASC');
            const result = await queryBuilder.getMany();
            return this.trimWhitespace(result);
        }
        catch (error) {
            this.logger.error(`Error fetching Kotak CMS data with complex query: ${error instanceof Error ? error.message : String(error)}`, error);
            throw new Error(`Failed to fetch Kotak CMS data: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    // Keep trimWhitespace, likely provided by decorator
    trimWhitespace(obj) {
        return obj;
    }
};
exports.KotakCMSProvider = KotakCMSProvider;
exports.KotakCMSProvider = KotakCMSProvider = __decorate([
    objectDecorators_1.objectDecorators,
    __param(0, (0, tsyringe_1.inject)(data_source_provider_1.AppDataSource)),
    __metadata("design:paramtypes", [data_source_provider_1.AppDataSource])
], KotakCMSProvider);
