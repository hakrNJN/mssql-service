"use strict";
//src/providers/saleTransaction.provider.ts
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
exports.SaleTransactionProvider = void 0;
const tsyringe_1 = require("tsyringe");
const objectDecorators_1 = require("../decorators/objectDecorators");
const saleTransaction_entity_1 = require("../entity/phoenixDb/saleTransaction.entity");
const logger_1 = require("../utils/logger");
const phoenix_data_source_provider_1 = require("./phoenix.data-source.provider");
let SaleTransactionProvider = class SaleTransactionProvider {
    constructor(dataSourceInstance) {
        this.SaleTransactionRepository = null; // Changed ViewEntity to Repository
        this.dataSourceInstance = dataSourceInstance;
        this.logger = tsyringe_1.container.resolve(logger_1.WINSTON_LOGGER);
    }
    _getRepository() {
        if (!this.SaleTransactionRepository) {
            throw new Error("Sale transaction repository not initialized. Call initializeRepository() first.");
        }
        return this.SaleTransactionRepository;
    }
    async initializeRepository() {
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.SaleTransactionRepository = dataSource.getRepository(saleTransaction_entity_1.SaleTransaction);
    }
    async getTransactionById(id) {
        try {
            const transaction = await this._getRepository().findOne({
                where: { SalTrnId: id },
                relations: ['products'], // Correct relations is specified
            });
            return this.trimWhitespace(transaction) || null; // Trimming is applied here
        }
        catch (error) {
            this.logger.error("Error fetching sale transaction:", error);
            return null; // or throw error
        }
    }
};
exports.SaleTransactionProvider = SaleTransactionProvider;
exports.SaleTransactionProvider = SaleTransactionProvider = __decorate([
    objectDecorators_1.objectDecorators,
    __metadata("design:paramtypes", [phoenix_data_source_provider_1.PhoenixDataSource])
], SaleTransactionProvider);
