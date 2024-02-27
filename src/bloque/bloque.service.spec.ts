import { Test, TestingModule } from '@nestjs/testing';
import { BloqueService } from './bloque.service';

describe('BloqueService', () => {
  let service: BloqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BloqueService],
    }).compile();

    service = module.get<BloqueService>(BloqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
