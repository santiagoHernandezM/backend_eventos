import { Test, TestingModule } from '@nestjs/testing';
import { CompetenciaController } from './competencia.controller';

describe('CompetenciaController', () => {
  let controller: CompetenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetenciaController],
    }).compile();

    controller = module.get<CompetenciaController>(CompetenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
