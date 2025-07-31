import { Router } from 'express';
import { PhoenixDataSource } from '../providers/phoenix.data-source.provider';
declare const saleTransactionRoute: (dataSource: PhoenixDataSource) => Router;
export default saleTransactionRoute;
