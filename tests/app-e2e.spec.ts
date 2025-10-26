
import { ExpressTestAdapter, type ExpressTestModule } from '@/adapters/http/express/ExpressTestAdapter';
import prismaMock from '@/infrastructure/database/prisma/mock';
import { makePokemonFactoryRoute } from '@/infrastructure/factories/pokemon/PokemonFactoryRoute';

describe('Pokemon E2E Tests', () => {
  let app: ExpressTestModule;

  beforeAll(() => {
    app = new ExpressTestAdapter()
      .setPrefix('/api/v1')
      .createTestModule({
        factories: [makePokemonFactoryRoute]
      });
  });

  it('should responds with pokemon list', async () => {
    prismaMock.pokemon.findMany.mockResolvedValueOnce([
      { id: 1, type: 'Pikachu', trainer: 'Ash', level: 10, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, type: 'Bulbasaur', trainer: 'Misty', level: 12, createdAt: new Date(), updatedAt: new Date() },
    ]);

    const response = await app
      .get('/api/v1/pokemons')
      .expect(200);

    expect(response.body).toEqual([
      { id: 1, tipo: 'Pikachu', treinador: 'Ash', nivel: 10 },
      { id: 2, tipo: 'Bulbasaur', treinador: 'Misty', nivel: 12 },
    ]);
  });

  it('should get a pokemon by id', async () => {
    const pokemonId = 1;

    prismaMock.pokemon.findFirst.mockResolvedValueOnce({
      id: pokemonId,
      type: 'Pikachu',
      trainer: 'Ash',
      level: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await app
      .get(`/api/v1/pokemons/${pokemonId}`)
      .expect(200);

    expect(response.body).toEqual({
      id: pokemonId,
      tipo: 'Pikachu',
      treinador: 'Ash',
      nivel: 10,
    });
  });

  it('should create a new pokemon', async () => {
    const newPokemon = { tipo: 'Charmander', treinador: 'Brock' };

    prismaMock.pokemon.create.mockResolvedValueOnce({
      id: 3,
      type: newPokemon.tipo,
      trainer: newPokemon.treinador,
      level: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await app
      .post('/api/v1/pokemons')
      .send(newPokemon)
      .expect(201);

    expect(response.body).toEqual({
      id: 3,
      tipo: 'Charmander',
      treinador: 'Brock',
      nivel: 3,
    });
  });

  it('should update a pokemon trainer', async () => {
    const updatedTrainer = { treinador: 'Soraia' };
    const pokemonId = 1;

    prismaMock.pokemon.update.mockResolvedValueOnce({
      id: pokemonId,
      type: 'Pikachu',
      trainer: updatedTrainer.treinador,
      level: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await app
      .put(`/api/v1/pokemons/${pokemonId}`)
      .send(updatedTrainer)
      .expect(204);
  });

  it('should delete a pokemon by id', async () => {
    const pokemonId = 1;

    prismaMock.pokemon.delete.mockResolvedValueOnce({
      id: pokemonId,
      type: 'Pikachu',
      trainer: 'Ash',
      level: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await app
      .delete(`/api/v1/pokemons/${pokemonId}`)
      .expect(204);
  });
});
