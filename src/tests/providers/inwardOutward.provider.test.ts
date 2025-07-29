// src/tests/inwardOutward.provider.test.ts
import { container } from 'tsyringe';
import { SpTblFinishInWardOutWard } from '../../entity/anushree/SpTblFinishInWardOutWard.entity';
import { HttpException } from '../../exceptions/httpException';
import { ILogger } from '../../interface/logger.interface';
import { AppDataSource } from '../../providers/data-source.provider';
import { InWardOutWardProvider } from '../../providers/inwardOutward.provider';
import { WINSTON_LOGGER } from '../../utils/logger';

// Mock the logger
const mockLogger: winston.Logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as winston.Logger;
container.register<winston.Logger>(WINSTON_LOGGER, { useValue: mockLogger });

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

// Mock AppDataSource
jest.mock('../../providers/data-source.provider', () => ({
  AppDataSource: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue({ getRepository: jest.fn() }),
    getDataSource: jest.fn().mockReturnValue({
      createQueryRunner: () => mockQueryRunner,
    }),
  })),
}));

// Mock TypeORM repository
const mockRepository = {
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(),
};

describe('InWardOutWardProvider', () => {
  let provider: InWardOutWardProvider;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockDataSource = new AppDataSource(mockLogger) as jest.Mocked<AppDataSource>;
    (mockQueryRunner.manager.getRepository as jest.Mock).mockReturnValue(mockRepository);

    provider = new InWardOutWardProvider(mockDataSource);
    await provider.initializeRepository();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAll', () => {
    it('should throw NotImplemented error', async () => {
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
      await expect(provider.create({})).rejects.toThrow(HttpException.NotImplemented());
    });

    it('should throw NotImplemented for update', async () => {
      await expect(provider.update(1, {})).rejects.toThrow(HttpException.NotImplemented());
    });

    it('should throw NotImplemented for delete', async () => {
      await expect(provider.delete(1)).rejects.toThrow(HttpException.NotImplemented());
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