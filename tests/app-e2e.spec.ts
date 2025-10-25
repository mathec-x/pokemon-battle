
import { ExpressTestAdapter, type ExpressTestModule } from '@/adapters/http/express/ExpressTestAdapter';
import { makeUserFactoryRoute } from '@/infrastructure/factories/pokemon/PokemonFactoryRoute';

describe('GET /', () => {
  let app: ExpressTestModule;

  beforeAll(() => {
    app = new ExpressTestAdapter()
      .setPrefix('/api')
      .createTestModule({
        factories: [makeUserFactoryRoute]
      });
  });

  it('should responds with json message', async () => {
    const response = await app
      .get('/api/user')
      .expect(200);

    expect(response.body).toStrictEqual({ body: 'Get User Ok' });
  });
});
