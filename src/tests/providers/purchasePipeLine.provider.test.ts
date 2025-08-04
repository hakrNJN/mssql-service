// src/tests/providers/purchasePipeLine.provider.test.ts
import { PurchasePileLine } from '../../providers/purchasePipeLine.provider';
import { PurchasePipeLine as PurchasePipeLineEntity } from '../../entity/phoenixDb/purchasePipeLine.entity';
import { applyFilters } from '../../utils/query-utils';
import { ILogger } from '../../interface/logger.interface';
import { DataSource, Repository } from 'typeorm';

// Mock the logger
const mockLogger: jest.Mocked<ILogger> = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
} as jest.Mocked<ILogger>;

// Mock query-utils
jest.mock('../../utils/query-utils', () => ({
  applyFilters: jest.fn((qb) => ({
    ...qb,
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  })),
}));

// Mock TypeORM repository
const mockRepository: jest.Mocked<Repository<PurchasePipeLineEntity>> = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    getMany: jest.fn(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  }),
} as jest.Mocked<Repository<PurchasePipeLineEntity>>;

describe('PurchasePileLine', () => {
  let provider: PurchasePileLine;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
      initialize: jest.fn(),
      destroy: jest.fn(),
      isInitialized: true,
    } as unknown as jest.Mocked<DataSource>;

    provider = new PurchasePileLine(mockDataSource, mockLogger);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all records', async () => {
      const mockData = [new PurchasePipeLineEntity(), new PurchasePipeLineEntity()];
      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await provider.getAll(0, 10);

      expect(result).toEqual(mockData);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('purchasePipeline');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('purchasePipeline.Purtrnid', 'ASC');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('getAllWithFilters', () => {
    it('should get records with filters', async () => {
      const mockData = [new PurchasePipeLineEntity(), new PurchasePipeLineEntity()];
      const mockQueryBuilder = {
        getMany: jest.fn().mockResolvedValue(mockData),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder as any);

      const filters = { Purtrnid: { equal: 1 } };
      const result = await provider.getAllWithFilters(filters, 0, 10);

      expect(result).toEqual(mockData);
      expect(applyFilters).toHaveBeenCalledWith(expect.any(Object), filters, 'purchasePipeline');
    });
  });

  describe('getById', () => {
    it('should get a record by id', async () => {
      const mockData = new PurchasePipeLineEntity();
      mockRepository.findOne.mockResolvedValue(mockData);

      const result = await provider.getById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { Purtrnid: 1 } });
    });
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const newData = { Purtrnid: 1 };
      const createdRecord = { ...new PurchasePipeLineEntity(), ...newData };
      mockRepository.create.mockReturnValue(createdRecord);
      mockRepository.save.mockResolvedValue(createdRecord);

      const result = await provider.create(newData);

      expect(result).toEqual(createdRecord);
      expect(mockRepository.create).toHaveBeenCalledWith(newData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdRecord);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const updateData = { Purtrnid: 1 };
      const updatedRecord = { ...new PurchasePipeLineEntity(), ...updateData };
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(provider, 'getById').mockResolvedValue(updatedRecord);

      const result = await provider.update(1, updateData);

      expect(result).toEqual(updatedRecord);
      expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, expect.any(Object));
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await provider.delete(1);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});