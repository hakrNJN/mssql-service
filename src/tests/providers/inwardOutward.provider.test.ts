// src/tests/providers/inwardOutward.provider.test.ts
import { SpTblFinishInWardOutWard } from '../../entity/anushreeDb/spTblFinishInWardOutWard.entity';
import { HttpException } from '../../exceptions/httpException';
import { ILogger } from '../../interface/logger.interface';
import { AppDataSource } from '../../providers/data-source.provider';
import { InWardOutWardProvider } from '../../providers/inwardOutward.provider';

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

// Mock QueryRunner
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  query: jest.fn(),
  manager: {
    getRepository: jest.fn(),
  },
};

// Mock TypeORM repository
const mockRepository = {
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(),
};

// Mock AppDataSource
const mockDataSourceInstance = {
  getRepository: jest.fn((entity) => {
    // You might want to return different repositories based on the entity if needed
    return mockRepository;
  }),
};

const mockDataSource = {
  init: jest.fn().mockResolvedValue(mockDataSourceInstance),
  getDataSource: jest.fn().mockReturnValue({
    createQueryRunner: () => mockQueryRunner,
  }),
};


describe('InWardOutWardProvider', () => {
  let provider: InWardOutWardProvider;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mockDataSourceInstance = mockDataSource as unknown as AppDataSource;
    provider = new InWardOutWardProvider(mockDataSourceInstance);
    // Manually inject logger
    (provider as any).logger = mockLogger;
    (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue(mockRepository);
    await provider.initializeRepository();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAll', () => {
    it('should throw an error', async () => {
      await expect(provider.getAll()).rejects.toThrow(
        'Cannot call getAll directly. Use getEntriesByFilter and provide SP parameters.'
      );
    });
  });

  describe('getById', () => {
    it('should get a record by id', async () => {
      const mockData = new SpTblFinishInWardOutWard();
      mockRepository.findOne.mockResolvedValue(mockData);
      const result = await provider.getById(1);
      expect(result).toEqual(mockData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { PurtrnId: 1 } });
    });
  });

  describe('create, update, delete', () => {
    it('should throw NotImplemented for create', async () => {
      await expect(provider.create({})).rejects.toThrow(HttpException.NotImplemented("Create operation not supported on view 'SpTblFinishInWardOutWard'."));
    });

    it('should throw NotImplemented for update', async () => {
      await expect(provider.update(1, {})).rejects.toThrow(HttpException.NotImplemented("Update operation not supported on view 'SpTblFinishInWardOutWard'."));
    });

    it('should throw NotImplemented for delete', async () => {
      await expect(provider.delete(1)).rejects.toThrow(HttpException.NotImplemented("Delete operation not supported on view 'SpTblFinishInWardOutWard'."));
    });
  });

  describe('getEntriesByFilter', () => {
    it('should execute SP and return data', async () => {
      const mockData = [{ Purtrnid: 1 }];
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockData),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await provider.getEntriesByFilter('conum', 'fdat', 'tdat', 'accId');

      expect(result).toEqual(mockData);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.query).toHaveBeenCalledWith(expect.stringContaining('EXEC'));
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('getEntryByIdFromSPData', () => {
    it('should execute SP and return a single record', async () => {
      const mockData = new SpTblFinishInWardOutWard();
      mockRepository.findOne.mockResolvedValue(mockData);

      const result = await provider.getEntryByIdFromSPData('conum', 'fdat', 'tdat', 'accId', 1);

      expect(result).toEqual(mockData);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.query).toHaveBeenCalledWith(expect.stringContaining('EXEC'));
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { PurtrnId: 1 } });
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });
});