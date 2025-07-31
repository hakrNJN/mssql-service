import { Router } from 'express';
import { AppDataSource } from '../providers/data-source.provider';
declare const companyRoute: (dataSource: AppDataSource) => Router;
export default companyRoute;
