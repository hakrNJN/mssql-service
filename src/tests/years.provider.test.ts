// __tests__/years.provider.test.ts
import { AppDataSource } from '../providers/data-source.provider';
import { YearsProvider } from '../providers/years.provider';
import { EqualFilter } from '../types/filter.types';

jest.mock('../src/providers/data-source.provider', () => {
    const mockGetRepository = jest.fn();
    return {
        AppDataSource: jest.fn().mockImplementation(() => ({
            init: jest.fn().mockResolvedValue(undefined), // Mock init to resolve immediately
            getRepository: mockGetRepository,
        })),
        mockGetRepository: mockGetRepository,
    };
});

jest.mock('typeorm', () => {
    const mockFind = jest.fn();
    const mockFindOneBy = jest.fn();
    const mockCreateQueryBuilder = jest.fn(() => ({
     where: jest.fn().mockReturnThis(),
     andWhere: jest.fn().mockReturnThis(),
     orderBy: jest.fn().mockReturnThis(),
     skip: jest.fn().mockReturnThis(),
     take: jest.fn().mockReturnThis(),
     getMany: jest.fn().mockResolvedValue([]),
     getOne: jest.fn().mockResolvedValue(undefined)
   }));
    return {
        Repository: jest.fn().mockImplementation(() => ({
            find: mockFind,
            findOneBy: mockFindOneBy,
            createQueryBuilder: mockCreateQueryBuilder,
        })),
        mockFind: mockFind,
        mockFindOneBy: mockFindOneBy,
        mockCreateQueryBuilder: mockCreateQueryBuilder,
    };
});

describe('YearsProvider', () => {
    let provider: YearsProvider;
    let mockDataSource: any;
    let mockYearRepository: any;

    beforeEach(async () => {
        mockDataSource = new AppDataSource();
        provider = new YearsProvider(mockDataSource);
        await provider.initializeRepository(); // Ensure repository is initialized
        mockYearRepository = (mockDataSource.getRepository as jest.Mock).mock.results[0].value
    });

    it('should get all years successfully', async () => {
        const mockYears = [{ id: 1, year: 2023 }, { id: 2, year: 2024 }];
        (mockYearRepository.find as jest.Mock).mockResolvedValue(mockYears);
        const years = await provider.getAllYears();
        expect(mockYearRepository.find).toHaveBeenCalled();
        expect(years).toEqual(mockYears);
    });

    it('should get a year by ID successfully', async () => {
        const mockYear = { id: 1, year: 2023 };
        (mockYearRepository.findOneBy as jest.Mock).mockResolvedValue(mockYear);

        const year = await provider.getYearById(1);
        expect(mockYearRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(year).toEqual(mockYear);
    });

    it('should handle error when getting all years', async () => {
        (mockYearRepository.find as jest.Mock).mockRejectedValue(new Error('Database error'));

        await expect(provider.getAllYears()).rejects.toThrow('Database error');
        expect(mockYearRepository.find).toHaveBeenCalled();
    });

    it('should get all years with filters successfully', async () => {
     const mockYears = [{ id: 1, year: 2023 }, { id: 2, year: 2024 }];
     (mockYearRepository.createQueryBuilder as jest.Mock).mockImplementation(() => ({
         where: jest.fn().mockReturnThis(),
         andWhere: jest.fn().mockReturnThis(),
         orderBy: jest.fn().mockReturnThis(),
         skip: jest.fn().mockReturnThis(),
         take: jest.fn().mockReturnThis(),
         getMany: jest.fn().mockResolvedValue(mockYears),
         getOne: jest.fn().mockResolvedValue(undefined)
       }));

        const filters = { id: { equal:17} as EqualFilter<number> }
     const years = await provider.getAllYearsWithFilters(filters);

     expect(mockYearRepository.createQueryBuilder).toHaveBeenCalled();
     expect(years).toEqual(mockYears);
 });
});
