// src/tests/purchasePipeLine.provider.test.ts
import { container } from 'tsyringe';
import { PurchasePipeLine as PurchasePipeLineEntity } from '../../entity/phoenix/PurchasePipeLine';
import winston from 'winston';
import { WINSTON_LOGGER } from '../../utils/logger';
import { AppDataSource } from '../../providers/data-source.provider';
import { PurchasePileLine } from '../../providers/purchasePipeLine.provider';
import { applyFilters } from '../../utils/query-utils';

// Mock the logger
const mockLogger: winston.Logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as winston.Logger;
container.register<winston.Logger>(WINSTON_LOGGER, { useValue: mockLogger });

// Mock AppDataSource
jest.mock('../../providers/data-source.provider', () => {
  const mockGetRepository = jest.fn();
  return {
    AppDataSource: jest.fn().mockImplementation(() => ({
      init: jest.fn().mockResolvedValue({
        getRepository: mockGetRepository,
      }),
      getRepository: mockGetRepository,
    })),
  };
});

// Mock query-utils
jest.mock('../../utils/query-utils', () => ({
  applyFilters: jest.fn(),
}));

// Mock TypeORM repository
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
};

describe('PurchasePileLine', () => {
  let provider: PurchasePileLine;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockGetRepository = jest.fn().mockReturnValue(mockRepository);
    mockDataSource = {
      init: jest.fn().mockResolvedValue({ getRepository: mockRepository }),
      getRepository: mockRepository,
    } as unknown as jest.Mocked<AppDataSource>;

    provider = new PurchasePileLine(mockDataSource);
    await provider.initializeRepository();
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
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      (applyFilters as jest.Mock).mockImplementation((qb, filters, alias) => {
        return mockQueryBuilder;
      });

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
      mockRepository.update.mockResolvedValue({ affected: 1 });
      // Mock getById to return the updated record
      jest.spyOn(provider, 'getById').mockResolvedValue(updatedRecord);

      const result = await provider.update(1, updateData);

      expect(result).toEqual(updatedRecord);
      expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, expect.any(Object));
    });

    it('should return null if update fails', async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await provider.update(1, { Purtrnid: 1 });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await provider.delete(1);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return false if delete fails', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await provider.delete(1);

      expect(result).toBe(false);
    });
  });
});