import { Mast } from '../../src/entity/anushreeDb/accounts.entity';
import { ILogger } from '../../src/interface/logger.interface';
import { AccountProvider } from '../../src/providers/account.provider';
import { DataSource } from "typeorm";
import { applyFilters } from '../../src/utils/query-utils';

// Mock the logger
const mockLogger: ILogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
} as jest.Mocked<ILogger>;

// Mock query-utils
jest.mock('../../src/utils/query-utils', () => ({
  applyFilters: jest.fn(),
}));

// Mock TypeORM repository
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }),
};

describe('AccountProvider', () => {
  let provider: AccountProvider;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock AppDataSource to return the mockRepository
    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    } as unknown as jest.Mocked<DataSource>;

    provider = new AccountProvider(mockDataSource, mockLogger);
    // Mock the trimWhitespace method
    jest.spyOn(provider, 'trimWhitespace').mockImplementation((data) => data);
    
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAllAccounts', () => {
    it('should get all accounts', async () => {
      const mockData: Mast[] = [
        {
          id: 1,
          Name: 'Test Account',
          Add1: '',
          Add2: '',
          City: '',
          State: '',
          PinCode: 123456,
          Mobile: '',
          Email: '',
          ContPerson: '',
          PanNo: '',
          GST: '',
          Status: '',
          Bank: '',
          AcNo: '',
          IFSCCode: '',
          BlackList: '',
          Type: 1,
          SchdId: 1,
          Group: 1,
          AgentId: 1,
        },
      ];
      mockRepository.find.mockResolvedValue(mockData);

      const result = await provider.getAllAccounts(0, 10);

      expect(result).toEqual(mockData);
      expect(mockRepository.find).toHaveBeenCalledWith({ skip: 0, take: 10, order: { id: 'ASC' } });
    });

    it('should return an empty array if no accounts are found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await provider.getAllAccounts(0, 10);

      expect(result).toEqual([]);
    });
  });

  describe('getAllAccountWithFilters', () => {
    it('should get accounts with filters', async () => {
      const mockData = [new Mast(), new Mast()];
      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };
      (applyFilters as jest.Mock<any, any>).mockReturnValue(mockQueryBuilder as any);

      const filters = { Name: { equal: 'Test' } };
      const result = await provider.getAllAccountWithFilters(filters, 0, 10);

      expect(result).toEqual(mockData);
      expect(applyFilters).toHaveBeenCalledWith(expect.any(Object), filters, 'account');
    });
  });

  describe('getAccountById', () => {
    it('should get an account by id', async () => {
      const mockData = new Mast();
      mockRepository.findOneBy.mockResolvedValue(mockData);

      const result = await provider.getAccountById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('getAgentByIdWithCustomers', () => {
    it('should get an agent with customers', async () => {
      const mockData = new Mast();
      mockRepository.findOne.mockResolvedValue(mockData);

      const result = await provider.getAgentByIdWithCustomers(1);

      expect(result).toEqual({ Agent: mockData });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, Type: 2 },
        relations: ['customers'],
      });
    });

    it('should return null if agent not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await provider.getAgentByIdWithCustomers(1);

      expect(result).toEqual({ Agent: null });
    });
  });
});