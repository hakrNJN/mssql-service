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
exports.AccountProvider = void 0;
// src/providers/account.provider.ts
const tsyringe_1 = require("tsyringe");
const objectDecorators_1 = require("../decorators/objectDecorators");
const accounts_entity_1 = require("../entity/anushreeDb/accounts.entity");
const logger_1 = require("../utils/logger");
const query_utils_1 = require("../utils/query-utils");
const data_source_provider_1 = require("./data-source.provider");
let AccountProvider = class AccountProvider {
    ;
    constructor(dataSourceInstance) {
        this.accountRepository = null;
        this.dataSourceInstance = dataSourceInstance;
        this.logger = tsyringe_1.container.resolve(logger_1.WINSTON_LOGGER);
    }
    _getRepository() {
        if (!this.accountRepository) {
            throw new Error("Account repository not initialized. Call initializeRepository() first.");
        }
        return this.accountRepository;
    }
    async initializeRepository() {
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.accountRepository = dataSource.getRepository(accounts_entity_1.Mast);
    }
    async getAllAccountWithFilters(filters, offset, limit) {
        try {
            const queryBuilder = this._getRepository().createQueryBuilder('account');
            const filteredQueryBuilder = (0, query_utils_1.applyFilters)(queryBuilder, filters, 'account'); // Call the imported utility function
            /* The code snippet you provided is checking if the `offset` and `limit` parameters are defined or not. If they are defined (not `undefined`), it will apply pagination to the query builder. */
            if (offset !== undefined) {
                filteredQueryBuilder.skip(offset);
            }
            if (limit !== undefined) {
                filteredQueryBuilder.take(limit);
            }
            filteredQueryBuilder.orderBy('account.id', 'ASC'); // Order by account id in ascending order
            const account = await filteredQueryBuilder.getMany();
            return this.trimWhitespace(account);
        }
        catch (error) {
            this.logger.error("Error fetching All Accounts with Filter", error);
            throw new Error(error);
        }
    }
    async getAllAccounts(offset, limit) {
        try {
            const findOptions = {}; // Using 'any' to avoid strict type issues, can be refined to FindManyOptions if needed
            if (offset !== undefined) {
                findOptions.skip = offset;
            }
            if (limit !== undefined) {
                findOptions.take = limit;
            }
            findOptions.order = { id: 'ASC' };
            const accounts = await this._getRepository().find(findOptions);
            return this.trimWhitespace(accounts);
        }
        catch (error) {
            this.logger.error("Error fetching All Accounts", error);
            throw new Error(error);
        }
    }
    async getAgentByIdWithCustomers(agentId) {
        try {
            const agent = await this._getRepository().findOne({
                where: {
                    id: agentId,
                    Type: 2 // Filter for Agent type
                },
                relations: ['customers'] // Eager load the 'customers' relation
            });
            if (!agent) {
                return { Agent: null }; // Return object with Agent: null when agent not found
            }
            return { Agent: this.trimWhitespace(agent) }; // Return object with Agent property
        }
        catch (error) {
            this.logger.error("Error fetching agent with customers (eager loading):", error);
            throw new Error(`Failed to fetch agent with customers (eager loading): ${error.message}`);
        }
    }
    async getAccountById(id) {
        return this._getRepository().findOneBy({ id });
    }
};
exports.AccountProvider = AccountProvider;
exports.AccountProvider = AccountProvider = __decorate([
    objectDecorators_1.objectDecorators,
    __metadata("design:paramtypes", [data_source_provider_1.AppDataSource])
], AccountProvider);
