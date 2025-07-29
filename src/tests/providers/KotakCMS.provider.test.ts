// src/tests/KotakCMS.provider.test.ts
import { container } from 'tsyringe';
import winston from 'winston';
import { Vwkotakcmsonline } from '../../entity/anushree/KotakCMS.entity';
import { SerMst } from '../../entity/anushree/series.entity';
import { AppDataSource } from '../../providers/data-source.provider';
import { KotakCMSProvider } from '../../providers/KotakCMS.provider';
import { WINSTON_LOGGER } from '../../utils/logger';


const mockWinstonLogger: jest.Mocked<winston.Logger> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
} as any; // Cast to any to satisfy type checking for the partial mock
container.register<winston.Logger>(WINSTON_LOGGER, { useValue: mockWinstonLogger });



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

describe('KotakCMSProvider', () => {
  let provider: KotakCMSProvider;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock getRepository to return the correct repository based on the entity
    jest.mock('../../providers/data-source.provider', () => ({
  AppDataSource: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue({
      getRepository: jest.fn(),
    }),
    getRepository: jest.fn(),
  })),
}));



    mockDataSource = new AppDataSource() as jest.Mocked<AppDataSource>;
    provider = new KotakCMSProvider(mockDataSource);
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

    it('should return null if record not found', async () => {
      mockKotakCMSRepository.findOne.mockResolvedValue(null);

      const result = await provider.getById(1);

      expect(result).toBeNull();
    });

    it('should throw an error if repository fails', async () => {
      const error = new Error('Database error');
      mockKotakCMSRepository.findOne.mockRejectedValue(error);

      await expect(provider.getById(1)).rejects.toThrow(error);
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

    it('should handle pagination correctly', async () => {
      await provider.getKotakCMSData(1, 100, 'C001', 17);
      expect(mockQueryBuilder.skip).not.toHaveBeenCalled();
      expect(mockQueryBuilder.take).not.toHaveBeenCalled();
    });

    it('should throw an error if the query fails', async () => {
      const error = new Error('Query failed');
      (mockQueryBuilder.getMany as jest.Mock).mockRejectedValue(error);

      await expect(provider.getKotakCMSData(1, 100, 'C001', 17)).rejects.toThrow('Failed to fetch Kotak CMS data: Query failed');
    });
  });
});