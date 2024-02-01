import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalTrialsController } from './professional-trials.controller';

describe('ProfessionalTrialsController', () => {
  let controller: ProfessionalTrialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalTrialsController],
    }).compile();

    controller = module.get<ProfessionalTrialsController>(ProfessionalTrialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
