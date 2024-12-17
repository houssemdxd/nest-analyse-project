import { Test, TestingModule } from '@nestjs/testing';
import { CliniqueController } from './clinique.controller';
import { CliniqueService } from './clinique.service';

describe('CliniqueController', () => {
  let controller: CliniqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CliniqueController],
      providers: [CliniqueService],
    }).compile();

    controller = module.get<CliniqueController>(CliniqueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
