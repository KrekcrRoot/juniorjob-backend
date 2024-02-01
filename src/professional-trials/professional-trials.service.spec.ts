import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalTrialsService } from './professional-trials.service';

describe('ProfessionalTrialsService', () => {
  let service: ProfessionalTrialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessionalTrialsService],
    }).compile();

    service = module.get<ProfessionalTrialsService>(ProfessionalTrialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
