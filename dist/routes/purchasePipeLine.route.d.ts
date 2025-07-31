import { Router } from 'express';
import { AppDataSource } from '../providers/data-source.provider';
declare const purchasePipeLineRoute: (dataSource: AppDataSource) => Router;
export default purchasePipeLineRoute;
