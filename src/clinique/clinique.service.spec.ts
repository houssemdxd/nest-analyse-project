import { Test, TestingModule } from '@nestjs/testing';
import { CliniqueService } from './clinique.service';

describe('CliniqueService', () => {
  let service: CliniqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CliniqueService],
    }).compile();

    service = module.get<CliniqueService>(CliniqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
