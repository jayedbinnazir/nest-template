import { Test, TestingModule } from '@nestjs/testing';
import { UserFileService } from './user_file.service';

describe('UserFileService', () => {
  let service: UserFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFileService],
    }).compile();

    service = module.get<UserFileService>(UserFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
