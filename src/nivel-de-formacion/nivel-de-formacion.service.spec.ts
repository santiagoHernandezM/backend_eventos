import { Test, TestingModule } from '@nestjs/testing';
import { NivelDeFormacionService } from './nivel-de-formacion.service';

describe('NivelDeFormacionService', () => {
  let service: NivelDeFormacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NivelDeFormacionService],
    }).compile();

    service = module.get<NivelDeFormacionService>(NivelDeFormacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
