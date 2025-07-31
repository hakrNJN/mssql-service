// src/tests/providers/KotakCMS.provider.test.ts
import { KotakCMSProvider } from '../../providers/kotakCMS.provider';
import { AppDataSource } from '../../providers/data-source.provider';
import { Vwkotakcmsonline } from '../../entity/anushreeDb/kotakCMS.entity';
import { SerMst } from '../../entity/anushreeDb/series.entity';
import { ILogger } from '../../interface/logger.interface';

// Mock the logger
const mockLogger: ILogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
};

// Mock TypeORM
const mockQueryBuilder = {
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
};

const mockKotakCMSRepository = {
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

const mockSerMstRepository = {
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

const mockDataSource = {
  init: jest.fn().mockResolvedValue({
    getRepository: jest.fn(entity => {
      if (entity === Vwkotakcmsonline) return mockKotakCMSRepository;
      if (entity === SerMst) return mockSerMstRepository;
      return {};
    }),
  }),
};

describe('KotakCMSProvider', () => {
  let provider: KotakCMSProvider;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mockDataSourceInstance = mockDataSource as unknown as AppDataSource;
    provider = new KotakCMSProvider(mockDataSourceInstance);
    // Manually inject logger
    (provider as any).logger = mockLogger;
    await provider.initializeRepository();
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