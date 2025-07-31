import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { Filters } from "../types/filter.types";
export declare function applyFilters<T extends ObjectLiteral>(// Add constraint 'extends ObjectLiteral' to T
queryBuilder: SelectQueryBuilder<T>, filters: Filters<T> | undefined, entityAlias: string): SelectQueryBuilder<T>;
