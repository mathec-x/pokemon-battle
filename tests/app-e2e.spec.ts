
import { ExpressTestAdapter, type ExpressTestModule } from '@/adapters/http/express/ExpressTestAdapter';
import { makePokemonFactoryRoute } from '@/infrastructure/factories/pokemon/PokemonFactoryRoute';

const prismaMock = {
  pokemon: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));


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
    const response = await app
      .get('/api/v1/pokemons')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
