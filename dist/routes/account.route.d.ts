import { Router } from 'express';
import { AppDataSource } from '../providers/data-source.provider';
declare const accountRoute: (dataSource: AppDataSource) => Router;
export default accountRoute;
