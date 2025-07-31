import { Router } from 'express';
import { AppDataSource } from '../providers/data-source.provider';
declare const yearRoute: (dataSource: AppDataSource) => Router;
export default yearRoute;
