/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpressTestAdapter, type ExpressTestModule } from '@/adapters/http/express/ExpressTestAdapter';
import { PokemonController } from './pokemonController';

// Mock factory with error-throwing use cases
const makeMockPokemonFactory = (errorType: 'get' | 'list' | 'create' | 'update' | 'delete') => {
  const mockUseCases = {
    getPokemon: { execute: jest.fn() },
    listPokemon: { execute: jest.fn() },
    createPokemon: { execute: jest.fn() },
    updatePokemon: { execute: jest.fn() },
    deletePokemon: { execute: jest.fn() }
  };

  // Configure which use case should throw error
  switch (errorType) {
    case 'get':
      mockUseCases.getPokemon.execute.mockRejectedValue(new Error('Database connection failed'));
      break;
    case 'list':
      mockUseCases.listPokemon.execute.mockRejectedValue(new Error('Query timeout'));
      break;
    case 'create':
      mockUseCases.createPokemon.execute.mockRejectedValue(new Error('Validation failed'));
      break;
    case 'update':
      mockUseCases.updatePokemon.execute.mockRejectedValue(new Error('Pokemon not found'));
      break;
    case 'delete':
      mockUseCases.deletePokemon.execute.mockRejectedValue(new Error('Delete constraint violation'));
      break;
  }

  return () => new PokemonController(
    mockUseCases.getPokemon as any,
    mockUseCases.listPokemon as any,
    mockUseCases.updatePokemon as any,
    mockUseCases.deletePokemon as any,
    mockUseCases.createPokemon as any
  );
};

describe('PokemonController - Error Handling', () => {
  describe('GET /pokemons - List Pokemon', () => {
    let app: ExpressTestModule;

    beforeAll(() => {
      app = new ExpressTestAdapter()
        .setPrefix('/api/v1')
        .createTestModule({
          factories: [makeMockPokemonFactory('list')]
        });
    });

    it('should handle error in list method and return 500', async () => {
      await app
        .get('/api/v1/pokemons')
        .expect(500)
        .expect((res) => {
          expect(res.body.message).toContain('Query timeout');
        });
    });
  });

  describe('GET /pokemons/:id - Get Pokemon', () => {
    let app: ExpressTestModule;

    beforeAll(() => {
      app = new ExpressTestAdapter()
        .setPrefix('/api/v1')
        .createTestModule({
          factories: [makeMockPokemonFactory('get')]
        });
    });

    it('should handle error in get method and return 500', async () => {
      await app
        .get('/api/v1/pokemons/1')
        .expect(500)
        .expect((res) => {
          expect(res.body.message).toContain('Database connection failed');
        });
    });
  });

  describe('POST /pokemons - Create Pokemon', () => {
    let app: ExpressTestModule;

    beforeAll(() => {
      app = new ExpressTestAdapter()
        .setPrefix('/api/v1')
        .createTestModule({
          factories: [makeMockPokemonFactory('create')]
        });
    });

    it('should handle error in create method and return 500', async () => {
      await app
        .post('/api/v1/pokemons')
        .send({ tipo: 'Pikachu', treinador: 'Ash' })
        .expect(500)
        .expect((res) => {
          expect(res.body.message).toContain('Validation failed');
        });
    });
  });

  describe('PUT /pokemons/:id - Update Pokemon', () => {
    let app: ExpressTestModule;

    beforeAll(() => {
      app = new ExpressTestAdapter()
        .setPrefix('/api/v1')
        .createTestModule({
          factories: [makeMockPokemonFactory('update')]
        });
    });

    it('should handle error in update method and return 500', async () => {
      await app
        .put('/api/v1/pokemons/1')
        .send({ treinador: 'Misty' })
        .expect(500)
        .expect((res) => {
          expect(res.body.message).toContain('Pokemon not found');
        });
    });
  });

  describe('DELETE /pokemons/:id - Delete Pokemon', () => {
    let app: ExpressTestModule;

    beforeAll(() => {
      app = new ExpressTestAdapter()
        .setPrefix('/api/v1')
        .createTestModule({
          factories: [makeMockPokemonFactory('delete')]
        });
    });

    it('should handle error in delete method and return 500', async () => {
      await app
        .delete('/api/v1/pokemons/1')
        .expect(500)
        .expect((res) => {
          expect(res.body.message).toContain('Delete constraint violation');
        });
    });
  });
});