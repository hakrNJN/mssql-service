import { Router } from 'express';
import { AppDataSource } from '../providers/data-source.provider';
declare const kotakCMSRoute: (dataSource: AppDataSource) => Router;
export default kotakCMSRoute;
