import { Router } from 'express';
import { AppDataSource } from '../providers/data-source.provider';
declare const seriesRoute: (dataSource: AppDataSource) => Router;
export default seriesRoute;
