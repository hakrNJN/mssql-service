// src/tests/providers/KotakCMS.provider.test.ts
import { KotakCMSProvider } from '../../providers/kotakCMS.provider';
import { Vwkotakcmsonline } from '../../entity/anushreeDb/kotakCMS.entity';
import { SerMst } from '../../entity/anushreeDb/series.entity';
import { ILogger } from '../../interface/logger.interface';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

// Mock the logger
const mockLogger: jest.Mocked<ILogger> = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
} as jest.Mocked<ILogger>;

// Mock TypeORM QueryBuilder
const mockQueryBuilder: jest.Mocked<SelectQueryBuilder<any>> = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  getQuery: jest.fn().mockReturnValue('SUBQUERY SQL'),
  getParameters: jest.fn().mockReturnValue({}),
  setParameters: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
} as jest.Mocked<SelectQueryBuilder<any>>;

// Mock TypeORM Repositories
const mockKotakCMSRepository: jest.Mocked<Repository<Vwkotakcmsonline>> = {
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
} as jest.Mocked<Repository<Vwkotakcmsonline>>;

const mockSerMstRepository: jest.Mocked<Repository<SerMst>> = {
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
} as jest.Mocked<Repository<SerMst>>;

// Mock DataSource
const mockDataSource: jest.Mocked<DataSource> = {
  getRepository: jest.fn((entity) => {
    if (entity === Vwkotakcmsonline) return mockKotakCMSRepository;
    if (entity === SerMst) return mockSerMstRepository;
    return {} as any; // Fallback for other entities
  }),
  initialize: jest.fn(),
  destroy: jest.fn(),
  isInitialized: true,
} as jest.Mocked<DataSource>;

describe('KotakCMSProvider', () => {
  let provider: KotakCMSProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new KotakCMSProvider(mockDataSource, mockLogger);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getById', () => {
    it('should return a record by vno', async () => {
      const mockRecord = { vno: 1, Conum: 'C001' } as Vwkotakcmsonline;
      mockKotakCMSRepository.findOne.mockResolvedValue(mockRecord);

      const result = await provider.getById(1);

      expect(result).toEqual(mockRecord);
      expect(mockKotakCMSRepository.findOne).toHaveBeenCalledWith({ where: { vno: 1 } });
    });
  });

  describe('getKotakCMSData', () => {
    it('should fetch data with the correct query', async () => {
      const mockData = [{ vno: 1, Conum: 'C001' }] as Vwkotakcmsonline[];
      (mockQueryBuilder.getMany as jest.Mock).mockResolvedValue(mockData);

      const result = await provider.getKotakCMSData(1, 100, 'C001', 17, 0, 10);

      expect(result).toEqual(mockData);

      // Verify main query
      expect(mockKotakCMSRepository.createQueryBuilder).toHaveBeenCalledWith('vwkotak');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('vwkotak.vno BETWEEN :fromVno AND :toVno', { fromVno: 1, toVno: 100 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('vwkotak.Conum = :conum', { conum: 'C001' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(`vwkotak.Type IN (SUBQUERY SQL)`);
      expect(mockQueryBuilder.setParameters).toHaveBeenCalledWith({});
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('vwkotak.vno', 'ASC');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();

      // Verify subquery
      expect(mockSerMstRepository.createQueryBuilder).toHaveBeenCalledWith('serMst');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('serMst.id');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('serMst.Type = :serMstType', { serMstType: 'Payment' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('serMst.Name NOT IN (:...excludedNames)', { excludedNames: ['Multi Payment', 'Cash Payment'] });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('serMst.YearId = :yearid', { yearid: 17 });
    });
  });
});