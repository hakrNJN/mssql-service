"use strict";
//src/services/account.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const account_provider_1 = require("../providers/account.provider");
class AccountService {
    constructor(dataSourceInstance) {
        this.dataSourceInstance = dataSourceInstance;
        this.accountProvider = new account_provider_1.AccountProvider(this.dataSourceInstance);
    }
    async initialize() {
        await this.accountProvider.initializeRepository();
    }
    async getAccountById(id) {
        return this.accountProvider.getAccountById(id);
    }
    async getAccounts(offset, limit) {
        return this.accountProvider.getAllAccounts(offset, limit);
    }
    async getAccountsWithFilters(filters, offset, limit) {
        return this.accountProvider.getAllAccountWithFilters(filters, offset, limit);
    }
    async getCustomers(offset, limit) {
        const filters = {
            Type: { equal: 6 },
            Status: { equal: 'T' },
        };
        return this.accountProvider.getAllAccountWithFilters(filters, offset, limit);
    }
    async getCustomerById(id) {
        const filters = {
            id: { equal: id },
            Type: { equal: 6 }
        };
        return this.accountProvider.getAllAccountWithFilters(filters, 0, 1);
    }
    async getCustomerByGST(gst) {
        const filters = {
            GST: { equal: gst },
            Type: { equal: 6 }
        };
        return this.accountProvider.getAllAccountWithFilters(filters, 0, 100);
    }
    async getTransporters(offset, limit) {
        const filters = {
            Type: { equal: 25 },
            Status: { equal: 'T' },
        };
        return this.accountProvider.getAllAccountWithFilters(filters, offset, limit);
    }
    async getAgents(offset, limit) {
        const filters = {
            Type: { equal: 2 },
            Status: { equal: 'T' },
        };
        return this.accountProvider.getAllAccountWithFilters(filters, offset, limit);
    }
    async getAgentByIdWithCustomers(id) {
        return this.accountProvider.getAgentByIdWithCustomers(id);
    }
}
exports.AccountService = AccountService;
