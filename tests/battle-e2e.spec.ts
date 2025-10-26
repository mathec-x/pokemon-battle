
import { ExpressTestAdapter, type ExpressTestModule } from '@/adapters/http/express/ExpressTestAdapter';
import prismaMock from '@/infrastructure/database/prisma/mock';
import { makePokemonFactoryRoute } from '@/infrastructure/factories/pokemon/PokemonFactoryRoute';

describe('Pokemon Battle E2E Tests', () => {
  let app: ExpressTestModule;

  beforeAll(() => {
    app = new ExpressTestAdapter()
      .setPrefix('/api/v1')
      .createTestModule({
        factories: [makePokemonFactoryRoute]
      });
  });

  it('should battle two pokemons and return the result', async () => {
    const pokemon1 = {
      id: 1,
      type: 'Pikachu',
      trainer: 'Ash',
      level: 99, // needs to be higher than pokemon2 level to win
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pokemon2 = {
      id: 2,
      type: 'Bulbasaur',
      trainer: 'Misty',
      level: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.pokemon.findFirst
      .mockResolvedValueOnce(pokemon1)
      .mockResolvedValueOnce(pokemon2);

    prismaMock.pokemon.update
      .mockResolvedValueOnce({ ...pokemon1, level: pokemon1.level + 1 }) // Winner level up
      .mockResolvedValueOnce({ ...pokemon2, level: Math.max(1, pokemon2.level - 1) }); // Loser level down  

    const response = await app
      .post('/api/v1/battle/1/2')
      .expect(200);

    expect(response.body).toEqual({
      vencedor: {
        id: 1,
        tipo: 'Pikachu',
        treinador: 'Ash',
        nivel: 100,
      },
      perdedor: {
        id: 2,
        tipo: 'Bulbasaur',
        treinador: 'Misty',
        nivel: 0,
      },
    });
  });
});

