import { Test, TestingModule } from '@nestjs/testing';
import { CategoryProductsService } from './category_products.service';

describe('CategoryProductsService', () => {
  let service: CategoryProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryProductsService],
    }).compile();

    service = module.get<CategoryProductsService>(CategoryProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
