"use strict";
//src/services/saleTransaction.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleTransactionService = void 0;
const saleTransaction_provider_1 = require("../providers/saleTransaction.provider");
class SaleTransactionService {
    constructor(dataSourceInstance) {
        this.dataSourceInstance = dataSourceInstance;
        this.saleTransactionProvider = new saleTransaction_provider_1.SaleTransactionProvider(this.dataSourceInstance);
    }
    async initialize() {
        await this.saleTransactionProvider.initializeRepository();
    }
    async getTransactionById(id) {
        return this.saleTransactionProvider.getTransactionById(id);
    }
}
exports.SaleTransactionService = SaleTransactionService;
