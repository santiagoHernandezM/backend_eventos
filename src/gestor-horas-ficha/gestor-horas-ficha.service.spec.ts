import { Test, TestingModule } from '@nestjs/testing';
import { GestorHorasFichaService } from './gestor-horas-ficha.service';

describe('GestorHorasFichaService', () => {
  let service: GestorHorasFichaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GestorHorasFichaService],
    }).compile();

    service = module.get<GestorHorasFichaService>(GestorHorasFichaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
