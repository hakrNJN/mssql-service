import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { PurchasePipeLine as PurchasePipeLineEntity } from '../../src/entity/phoenixDb/purchasePipeLine.entity';
import { ILogger } from '../../src/interface/logger.interface';
import { PurchasePileLine } from '../../src/providers/purchasePipeLine.provider';
import { applyFilters } from '../../src/utils/query-utils';

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

// Mock query-utils
jest.mock('../../src/utils/query-utils', () => ({
  applyFilters: jest.fn((qb) => ({
    ...qb,
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  })),
}));

describe('PurchasePileLine', () => {
  let provider: PurchasePileLine;
  let mockRepository: Partial<Repository<PurchasePipeLineEntity>> & {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    createQueryBuilder: jest.Mock;
  };
  let mockDataSource: Partial<DataSource>;
  let mockQueryBuilder: Partial<SelectQueryBuilder<PurchasePipeLineEntity>> & {
    getMany: jest.Mock;
    skip: jest.Mock;
    take: jest.Mock;
    orderBy: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockQueryBuilder = {
      getMany: jest.fn(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
    };

    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    provider = new PurchasePileLine(mockDataSource as DataSource, mockLogger);

    jest.spyOn(provider, 'trimWhitespace').mockImplementation((data) => data);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all records', async () => {
      const mockData = [{} as PurchasePipeLineEntity, {} as PurchasePipeLineEntity];
      mockQueryBuilder.getMany.mockResolvedValue(mockData);

      const result = await provider.getAll(0, 10);

      expect(result).toEqual(mockData);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('purchasePipeline');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('purchasePipeline.Purtrnid', 'ASC');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(provider.trimWhitespace).toHaveBeenCalledWith(mockData);
    });
  });

  describe('getAllWithFilters', () => {
    it('should get records with filters', async () => {
      const mockData = [{} as PurchasePipeLineEntity, {} as PurchasePipeLineEntity];
      mockQueryBuilder.getMany.mockResolvedValue(mockData);
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder);

      const filters = { Purtrnid: { equal: 1 } };
      const result = await provider.getAllWithFilters(filters, 0, 10);

      expect(result).toEqual(mockData);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('purchasePipeline');
      expect(applyFilters).toHaveBeenCalledWith(mockQueryBuilder, filters, 'purchasePipeline');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('purchasePipeline.Purtrnid', 'ASC');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(provider.trimWhitespace).toHaveBeenCalledWith(mockData);
    });
  });

  describe('getById', () => {
    it('should get a record by id', async () => {
      const mockData = { Purtrnid: 1 } as PurchasePipeLineEntity;
      mockRepository.findOne.mockResolvedValue(mockData);

      const result = await provider.getById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { Purtrnid: 1 } });
      expect(provider.trimWhitespace).toHaveBeenCalledWith(mockData);
    });

    it('should return null if record not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await provider.getById(1);

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { Purtrnid: 1 } });
      expect(provider.trimWhitespace).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const newData = { Purtrnid: 1 } as PurchasePipeLineEntity;
      const createdRecord = { ...newData, someOtherProp: 'value' } as PurchasePipeLineEntity;
      mockRepository.create.mockReturnValue(createdRecord);
      mockRepository.save.mockResolvedValue(createdRecord);

      const result = await provider.create(newData);

      expect(result).toEqual(createdRecord);
      expect(mockRepository.create).toHaveBeenCalledWith(newData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdRecord);
      expect(provider.trimWhitespace).toHaveBeenCalledWith(createdRecord);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const updateData = { Purtrnid: 1, BillNo: 'updatedBill' } as Partial<PurchasePipeLineEntity>;
      const updatedRecord = { Purtrnid: 1, BillNo: 'updatedBill' } as PurchasePipeLineEntity;
      mockRepository.update.mockResolvedValue({ affected: 1 });
      jest.spyOn(provider, 'getById').mockResolvedValue(updatedRecord);

      const result = await provider.update(1, updateData);

      expect(result).toEqual(updatedRecord);
      expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, expect.objectContaining(updateData));
      expect(provider.getById).toHaveBeenCalledWith(1);
    });

    it('should return null if record not found for update', async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await provider.update(1, { BillNo: 'updated' });

      expect(result).toBeNull();
      expect(mockRepository.update).toHaveBeenCalledWith({ id: 1 }, expect.any(Object));
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await provider.delete(1);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return false if no record was deleted', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await provider.delete(1);

      expect(result).toBe(false);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
