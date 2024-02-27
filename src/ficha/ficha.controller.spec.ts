import { Test, TestingModule } from '@nestjs/testing';
import { FichaController } from './ficha.controller';

describe('FichaController', () => {
  let controller: FichaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FichaController],
    }).compile();

    controller = module.get<FichaController>(FichaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
