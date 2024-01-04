import { Test, TestingModule } from '@nestjs/testing';
import { VacancyResponsesController } from './vacancy-responses.controller';

describe('VacancyResponsesController', () => {
  let controller: VacancyResponsesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacancyResponsesController],
    }).compile();

    controller = module.get<VacancyResponsesController>(
      VacancyResponsesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
