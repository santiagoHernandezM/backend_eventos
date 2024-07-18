import { Test, TestingModule } from '@nestjs/testing';
import { GestorHorasFichaController } from './gestor-horas-ficha.controller';
import { GestorHorasFichaService } from './gestor-horas-ficha.service';

describe('GestorHorasFichaController', () => {
  let controller: GestorHorasFichaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GestorHorasFichaController],
      providers: [GestorHorasFichaService],
    }).compile();

    controller = module.get<GestorHorasFichaController>(GestorHorasFichaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
