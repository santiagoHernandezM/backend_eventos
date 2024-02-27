import { Test, TestingModule } from '@nestjs/testing';
import { NivelDeFormacionController } from './nivel-de-formacion.controller';

describe('NivelDeFormacionController', () => {
  let controller: NivelDeFormacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NivelDeFormacionController],
    }).compile();

    controller = module.get<NivelDeFormacionController>(
      NivelDeFormacionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
