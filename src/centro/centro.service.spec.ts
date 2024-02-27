import { Test, TestingModule } from '@nestjs/testing';
import { CentroService } from './centro.service';

describe('CentroService', () => {
  let service: CentroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CentroService],
    }).compile();

    service = module.get<CentroService>(CentroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
