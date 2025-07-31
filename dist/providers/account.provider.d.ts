import { Mast } from "../entity/anushreeDb/accounts.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { AppDataSource } from "./data-source.provider";
export interface AccountProvider extends BaseProviderInterface<Mast, Filters<Mast>> {
    trimWhitespace<T>(obj: T): T;
}
export declare class AccountProvider {
    private accountRepository;
    private dataSourceInstance;
    private readonly logger;
    constructor(dataSourceInstance: AppDataSource);
    private _getRepository;
    initializeRepository(): Promise<void>;
    getAllAccountWithFilters(filters?: Filters<Mast>, offset?: number, limit?: number): Promise<Mast[]>;
    getAllAccounts(offset?: number, limit?: number): Promise<Mast[]>;
    getAgentByIdWithCustomers(agentId: number): Promise<{
        Agent: Mast | null;
    }>;
    getAccountById(id: number): Promise<Mast | null>;
}
