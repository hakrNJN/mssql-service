import { ObjectLiteral } from "typeorm";
import { Filters } from "../types/filter.types";
export interface BaseProviderInterface<Entity extends ObjectLiteral, FilterType extends Filters<Entity>> {
    trimWhitespace?<T>(obj: T): T;
    initializeRepository(): Promise<void>;
    getAllWithFilters(filters?: FilterType, offset?: number, limit?: number): Promise<Entity[]>;
    getAll(offset?: number, limit?: number): Promise<Entity[]>;
    getById(id: number): Promise<Entity | null>;
    create(data: Partial<Entity>): Promise<Entity>;
    update(id: number, data: Partial<Entity>): Promise<Entity | null>;
    delete(id: number): Promise<boolean>;
}
