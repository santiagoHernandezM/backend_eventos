import { Test, TestingModule } from '@nestjs/testing';
import { BloqueController } from './bloque.controller';

describe('BloqueController', () => {
  let controller: BloqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloqueController],
    }).compile();

    controller = module.get<BloqueController>(BloqueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
