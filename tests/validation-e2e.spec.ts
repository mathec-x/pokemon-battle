/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpressTestAdapter, type ExpressTestModule } from '@/adapters/http/express/ExpressTestAdapter';
import prismaMock from '@/infrastructure/database/prisma/mock';
import { makeBattleFactoryRoute, makePokemonFactoryRoute } from '@/infrastructure/factories/pokemon/PokemonFactoryRoute';

describe('App validation test', () => {
  let app: ExpressTestModule;

  beforeAll(() => {
    app = new ExpressTestAdapter()
      .setPrefix('/api/v1')
      .createTestModule({
        factories: [makeBattleFactoryRoute, makePokemonFactoryRoute]
      });

    const pokemons = [
      { id: 1, type: 'Pikachu', trainer: 'Ash', level: 10, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, type: 'Bulbasaur', trainer: 'Misty', level: 12, createdAt: new Date(), updatedAt: new Date() },
    ];
    prismaMock.pokemon.findMany.mockResolvedValue(pokemons);
    prismaMock.pokemon.findFirst.mockImplementation((params): any => {
      return pokemons.find(p => p.id === params?.where?.id) || null;
    });
  });

  it('should respond to an unknown route with 404', async () => {
    await app
      .get('/api/v1/unknown-route')
      .expect(404);
  });

  describe('Invalid input tests', () => {
    it('should validate request body on create pokemon', async () => {
      await app
        .post('/api/v1/pokemons')
        .send({ tipo: null, treinador: 'Ash' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toContain('Invalid input');
          expect(body.fieldErrors).toContain('✖ Invalid input: expected string, received null\n  → at tipo');
        });
    });

    it('should validate request body on update pokemon', async () => {
      await app
        .put('/api/v1/pokemons/1')
        .send({ tipo: 'Charmander' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toContain('Invalid input');
          expect(body.fieldErrors).toContain('✖ Invalid input: expected string, received undefined\n  → at treinador');
        });
    });

    it('should validate request params on delete pokemon', async () => {
      await app
        .delete('/api/v1/pokemons/xyz')
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBe('Invalid input');
        });
    });
  });

  describe('validate request', () => {
    it('should return not found on incorrect id', async () => {
      await app
        .get('/api/v1/pokemons/3')
        .expect(404)
        .expect(({ body }) => {
          expect(body.message).toBe('No pokemon data with id: 3');
        });
    });

    it('should validate on invalid both', async () => {
      await app
        .post('/api/v1/battle/abc/def')
        .expect(404)
        .expect(({ body }) => {
          expect(body.message).toContain('Pokémon NaN não encontrado');
        });
    });

    it('should validate on second invalid', async () => {
      await app
        .post('/api/v1/battle/1/3')
        .expect(404)
        .expect(({ body }) => {
          expect(body.message).toContain('Pokémon 3 não encontrado');
        });
    });
  });
});

