import { Test, TestingModule } from '@nestjs/testing';
import { TipoDeVinculacionController } from './tipo-de-vinculacion.controller';

describe('TipoDeVinculacionController', () => {
  let controller: TipoDeVinculacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoDeVinculacionController],
    }).compile();

    controller = module.get<TipoDeVinculacionController>(
      TipoDeVinculacionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
