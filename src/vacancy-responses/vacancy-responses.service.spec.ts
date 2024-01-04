import { Test, TestingModule } from '@nestjs/testing';
import { VacancyResponsesService } from './vacancy-responses.service';

describe('VacancyResponsesService', () => {
  let service: VacancyResponsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacancyResponsesService],
    }).compile();

    service = module.get<VacancyResponsesService>(VacancyResponsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
