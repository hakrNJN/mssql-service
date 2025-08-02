// src/providers/account.provider.ts
import { inject, injectable } from "tsyringe";
import { DataSource, FindManyOptions, Repository, SelectQueryBuilder } from "typeorm";
import { objectDecorators } from "../decorators/objectDecorators";
import { Mast } from "../entity/anushreeDb/accounts.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { ILogger } from "../interface/logger.interface";
import { MAIN_DATA_SOURCE } from "../services/dataSourceManager.service";
import { Filters } from "../types/filter.types";
import { WINSTON_LOGGER } from "../utils/logger";
import { applyFilters } from "../utils/query-utils";
export interface AccountProvider extends BaseProviderInterface<Mast, Filters<Mast>> {
    trimWhitespace<T>(obj: T): T;
}

@objectDecorators
@injectable()
export class AccountProvider {
    private accountRepository: Repository<Mast> | null = null;
    private readonly logger: ILogger;
    private readonly mainDataSource: DataSource;

    constructor(
        @inject(MAIN_DATA_SOURCE) mainDataSource: DataSource,
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.mainDataSource = mainDataSource;
        this.logger = logger;
    }

    private _getRepository(): Repository<Mast> {
        if (!this.accountRepository) {
            this.accountRepository = this.mainDataSource.getRepository(Mast);
            this.logger.info("AccountProvider repository initialized lazily.");
        }
        return this.accountRepository;
    }

    

    async getAllAccountWithFilters(filters?: Filters<Mast>, offset?: number, limit?: number): Promise<Mast[]> {
        try {
            const queryBuilder = this._getRepository().createQueryBuilder('account');
            const filteredQueryBuilder: SelectQueryBuilder<Mast> = applyFilters(queryBuilder, filters, 'account'); // Call the imported utility function

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
        } catch (error) {
            this.logger.error("Error fetching All Accounts with Filter", error);
            throw new Error(error as string)
        }
    }

    async getAllAccounts(offset?: number, limit?: number): Promise<Mast[]> {
        try {
            const findOptions: FindManyOptions = {}; // Using 'any' to avoid strict type issues, can be refined to FindManyOptions if needed
            if (offset !== undefined) {
                findOptions.skip = offset;
            }
            if (limit !== undefined) {
                findOptions.take = limit;
            }
            findOptions.order = { id: 'ASC' };
            const accounts: Mast[] = await this._getRepository().find(findOptions);
            return this.trimWhitespace(accounts)
        } catch (error) {
            this.logger.error("Error fetching All Accounts", error);
            throw new Error(error as string)
        }
    }

    async getAgentByIdWithCustomers(agentId: number): Promise<{ Agent: Mast | null }> { // Return type adjusted
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

        } catch (error) {
            this.logger.error("Error fetching agent with customers (eager loading):", error);
            throw new Error(`Failed to fetch agent with customers (eager loading): ${(error as Error).message}`);
        }
    }

    async getAccountById(id: number): Promise<Mast | null> {
        return await this._getRepository().findOneBy({ id });
    }

    // Additional CRUD Methods
    // async createCompany(companyData: Partial<CompMst>): Promise<CompMst> {
    //     const company = this._getRepository().create(companyData);
    //     return this._getRepository().save(company);
    // }

    // async updateCompany(id: number, companyData: Partial<CompMst>): Promise<CompMst | null> {
    //     await this._getRepository().update(id, companyData);
    //     return this.getCompanyById(id); // Return the updated company
    // }

    // async deleteCompany(id: number): Promise<boolean> {
    //     const deleteResult = await this._getRepository().delete(id);
    //     return (deleteResult.affected ?? 0) > 0;; // Return true if deletion was successful
    // }
}