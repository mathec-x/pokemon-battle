import { ExpressTestAdapter, ExpressTestModule } from '@/adapters/http/express/ExpressTestAdapter';
import { BattlePokemonUseCase } from '@/application/use-cases/pokemon/BattlePokemonUseCase';
import { NotFoundException } from '@/core/exceptions/NotFoundException';
import { BattleController } from './battleController';

describe('BattleController', () => {
  let app: ExpressTestModule;

  const makeMockBattleFactory = (battleUseCase: BattlePokemonUseCase) => {
    return () => new BattleController(battleUseCase);
  };

  describe('POST /battle/:id1/:id2', () => {
    it('should return 404 when BattlePokemonUseCase throws NotFoundException', async () => {
      const mockBattleUseCase = {
        execute: jest.fn().mockRejectedValue(new NotFoundException('Pokémon 1 não encontrado'))
      } as unknown as BattlePokemonUseCase;

      app = new ExpressTestAdapter().createTestModule({
        factories: [makeMockBattleFactory(mockBattleUseCase)]
      });

      const response = await app.post('/battle/1/2');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Pokémon 1 não encontrado'
      });
      expect(mockBattleUseCase.execute).toHaveBeenCalledWith(1, 2);
    });

    it('should return 500 when BattlePokemonUseCase throws generic error', async () => {
      const mockBattleUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Database connection failed'))
      } as unknown as BattlePokemonUseCase;

      app = new ExpressTestAdapter().createTestModule({
        factories: [makeMockBattleFactory(mockBattleUseCase)]
      });

      const response = await app.post('/battle/999/888');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Database connection failed'
      });
      expect(mockBattleUseCase.execute).toHaveBeenCalledWith(999, 888);
    });

    it('should return 500 when BattlePokemonUseCase throws unexpected error', async () => {
      const mockBattleUseCase = {
        execute: jest.fn().mockRejectedValue(new Error('Unexpected repository error'))
      } as unknown as BattlePokemonUseCase;

      app = new ExpressTestAdapter().createTestModule({
        factories: [makeMockBattleFactory(mockBattleUseCase)]
      });

      const response = await app.post('/battle/123/456');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Unexpected repository error'
      });
      expect(mockBattleUseCase.execute).toHaveBeenCalledWith(123, 456);
    });
  });
});
