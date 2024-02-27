import { Test, TestingModule } from '@nestjs/testing';
import { CentroController } from './centro.controller';

describe('CentroController', () => {
  let controller: CentroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CentroController],
    }).compile();

    controller = module.get<CentroController>(CentroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
