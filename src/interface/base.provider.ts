//base.provider.ts

import { ObjectLiteral } from "typeorm";
import { Filters } from "../types/filter.types";


export interface BaseProviderInterface<Entity extends ObjectLiteral, FilterType extends Filters<Entity>> {
    // trimWhitespace function declaration (if you want to include it in the interface, otherwise, it can be in the abstract class/base class if you decide to go that way)
    trimWhitespace?<T>(obj: T): T;

    // dataSourceInstance: AppDataSource;
    
    // _getRepository(): Repository<Entity>; // Make _getRepository public if you want to access it from outside, but usually private is better for encapsulation
    getAllWithFilters(filters?: FilterType, offset?: number, limit?: number): Promise<Entity[]>;
    getAll(offset?: number, limit?: number): Promise<Entity[]>;
    getById(id: number): Promise<Entity | null>;

    //Other common CRUD methods signatures here if needed in the interface
    create(data: Partial<Entity>): Promise<Entity>;
    update(id: number, data: Partial<Entity>): Promise<Entity | null>;
    delete(id: number): Promise<boolean>;
}