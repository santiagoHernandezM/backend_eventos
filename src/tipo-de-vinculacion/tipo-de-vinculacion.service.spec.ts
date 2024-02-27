import { Test, TestingModule } from '@nestjs/testing';
import { TipoDeVinculacionService } from './tipo-de-vinculacion.service';

describe('TipoDeVinculacionService', () => {
  let service: TipoDeVinculacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoDeVinculacionService],
    }).compile();

    service = module.get<TipoDeVinculacionService>(TipoDeVinculacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
