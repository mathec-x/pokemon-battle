/* eslint-disable @typescript-eslint/no-explicit-any */

import { ExpressTestAdapter, type ExpressTestModule } from '@/adapters/http/express/ExpressTestAdapter';
import prismaMock from '@/infrastructure/database/prisma/mock';
import { makeBattleFactoryRoute } from '@/infrastructure/factories/pokemon/PokemonFactoryRoute';

describe('Pokemon Battle E2E Tests', () => {
  let app: ExpressTestModule;

  beforeAll(() => {
    app = new ExpressTestAdapter()
      .setPrefix('/api/v1')
      .createTestModule({
        factories: [makeBattleFactoryRoute]
      });

    const pokemons = [
      { id: 1, type: 'Pikachu', trainer: 'Ash', level: 99, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, type: 'Bulbasaur', trainer: 'Misty', level: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, type: 'Charmander', trainer: 'Zenaide', level: 10, createdAt: new Date(), updatedAt: new Date() },
    ];
    prismaMock.pokemon.findMany.mockResolvedValue(pokemons);
    prismaMock.pokemon.findFirst.mockImplementation((params): any => {
      return pokemons.find(p => p.id === params?.where?.id) || null;
    });
  });

  it('should battle two pokemons and first wins', async () => {
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

  it('should battle two pokemons and second wins', async () => {
    const response = await app
      .post('/api/v1/battle/3/1')
      .expect(200);

    expect(response.body).toEqual({
      vencedor: {
        id: 1,
        tipo: 'Pikachu',
        treinador: 'Ash',
        nivel: 100,
      },
      perdedor: {
        id: 3,
        tipo: 'Charmander',
        treinador: 'Zenaide',
        nivel: 9,
      },
    });
  });
});

