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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasePileLine = void 0;
//src/providers/purchasePileLine.provider.ts
const tsyringe_1 = require("tsyringe");
const objectDecorators_1 = require("../decorators/objectDecorators");
const purchasePipeLine_entity_1 = require("../entity/phoenixDb/purchasePipeLine.entity"); // Alias the entity
const logger_1 = require("../utils/logger");
const query_utils_1 = require("../utils/query-utils");
const data_source_provider_1 = require("./data-source.provider");
let PurchasePileLine = class PurchasePileLine {
    constructor(dataSourceInstance) {
        this.purchasePipeLineRepository = null;
        this.dataSourceInstance = dataSourceInstance;
        this.logger = tsyringe_1.container.resolve(logger_1.WINSTON_LOGGER);
    }
    async getAll(offset, limit) {
        try {
            const queryBuilder = this._getRepository().createQueryBuilder('purchasePipeline');
            if (offset !== undefined) {
                queryBuilder.skip(offset);
            }
            if (limit !== undefined) {
                queryBuilder.take(limit);
            }
            queryBuilder.orderBy('purchasePipeline.Purtrnid', 'ASC');
            const records = await queryBuilder.getMany();
            return this.trimWhitespace(records);
        }
        catch (error) {
            this.logger.error("Error fetching all Purchase Pipe Line entries", error);
            throw new Error(error);
        }
    }
    _getRepository() {
        if (!this.purchasePipeLineRepository) {
            throw new Error("Purchase Pipe Line repository not initialized. Call initializeRepository() first.");
        }
        return this.purchasePipeLineRepository;
    }
    async initializeRepository() {
        const dataSource = await this.dataSourceInstance.init();
        this.purchasePipeLineRepository = dataSource.getRepository(purchasePipeLine_entity_1.PurchasePipeLine);
    }
    // Renamed from getAllWithFilters to getAll to satisfy BaseProviderInterface
    async getAllWithFilters(filters, offset, limit) {
        try {
            const queryBuilder = this._getRepository().createQueryBuilder('purchasePipeline');
            const filteredQueryBuilder = (0, query_utils_1.applyFilters)(queryBuilder, filters, 'purchasePipeline');
            if (offset !== undefined) {
                filteredQueryBuilder.skip(offset);
            }
            if (limit !== undefined) {
                filteredQueryBuilder.take(limit);
            }
            filteredQueryBuilder.orderBy('purchasePipeline.Purtrnid', 'ASC');
            const records = await filteredQueryBuilder.getMany();
            return this.trimWhitespace(records);
        }
        catch (error) {
            this.logger.error("Error fetching Purchase Pipe Line with Filter", error);
            throw new Error(error);
        }
    }
    // Implementation of BaseProviderInterface's getById, using the entity's actual primary key 'id'
    async getById(id) {
        try {
            const record = await this._getRepository().findOne({
                where: { Purtrnid: id } // Assuming 'id' is the primary generated column
            });
            return record ? this.trimWhitespace(record) : null;
        }
        catch (error) {
            this.logger.error(`Error fetching Purchase Pipe Line by id ${id}`, error);
            throw new Error(error);
        }
    }
    // New method for your specific composite key lookup
    // async getByPurtrnIdAndType(PurtrnId: number, type: number): Promise<PurchasePipeLineEntity | null> {
    //     try {
    //         const record = await this._getRepository().findOne({
    //             where: {
    //                 Purtrnid: PurtrnId,
    //                 Type: type
    //             }
    //         });
    //         return record ? this.trimWhitespace(record) : null;
    //     } catch (error) {
    //         this.logger.error(`Error fetching Purchase Pipe Line with PurtrnId ${PurtrnId} and Type ${type}`, error);
    //         throw new Error(error as string);
    //     }
    // }
    // Implementation of BaseProviderInterface's create
    async create(data) {
        try {
            const newRecord = this._getRepository().create(data);
            const savedRecord = await this._getRepository().save(newRecord);
            return this.trimWhitespace(savedRecord);
        }
        catch (error) {
            this.logger.error("Error inserting Purchase Pipe Line entry", error);
            throw new Error(error);
        }
    }
    // Implementation of BaseProviderInterface's update
    // Assuming BaseProviderInterface's update takes a single ID for update
    async update(id, data) {
        try {
            const updateData = { ...data, UpdDate: new Date() }; // Add current date for UpdDate
            const updateResult = await this._getRepository().update({ id: id }, // Update by the entity's primary key 'id'
            updateData);
            if ((updateResult.affected ?? 0) > 0) {
                return await this.getById(id); // Return the updated entity
            }
            return null; // Explicitly return null if not updated
        }
        catch (error) {
            this.logger.error(`Error updating Purchase Pipe Line with id ${id}`, error);
            throw new Error(error);
        }
    }
    // New specific update method if you need to update by Purtrnid and Type directly
    // async updateByPurtrnIdAndType(Purtrnid: number, type: number, data: Partial<PurchasePipeLineEntity>): Promise<boolean> {
    //     try {
    //         const updateData = { ...data, UpdDate: new Date() }; // Add current date for UpdDate
    //         const updateResult: UpdateResult = await this._getRepository().update(
    //             { Purtrnid: Purtrnid, Type: type }, // Update by Purtrnid and Type
    //             updateData
    //         );
    //         return (updateResult.affected ?? 0) > 0; // Fix: Use nullish coalescing
    //     } catch (error) {
    //         this.logger.error(`Error updating Purchase Pipe Line with Purtrnid ${Purtrnid} and Type ${type}`, error);
    //         throw new Error(error as string);
    //     }
    // }
    // Implementation of BaseProviderInterface's delete
    async delete(id) {
        try {
            const deleteResult = await this._getRepository().delete(id);
            return (deleteResult.affected ?? 0) > 0; // Fix: Use nullish coalescing
        }
        catch (error) {
            this.logger.error(`Error deleting Purchase Pipe Line with id ${id}`, error);
            throw new Error(error);
        }
    }
    // Placeholder for trimWhitespace, provided by decorator
    trimWhitespace(obj) {
        // This method is typically added by the @objectDecorators.
        // If not, you'd need a real implementation here.
        return obj;
    }
};
exports.PurchasePileLine = PurchasePileLine;
exports.PurchasePileLine = PurchasePileLine = __decorate([
    objectDecorators_1.objectDecorators,
    __metadata("design:paramtypes", [data_source_provider_1.AppDataSource])
], PurchasePileLine);
