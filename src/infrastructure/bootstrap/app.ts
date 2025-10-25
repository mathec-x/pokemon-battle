import { ExpressAdapter } from '@/adapters/http/express/ExpressAdapter';
import { setupSwagger } from '@/adapters/http/openapi/setupSwagger';
import { LoggerService } from '@/application/services/logger/LoggerService';
import { makePokemonFactoryRoute } from '@/infrastructure/factories/pokemon/PokemonFactoryRoute';

class App {
  private readonly logger = new LoggerService(App.name);

  bootstrap() {
    const app = new ExpressAdapter();
    app.setPrefix('/api/v1');
    app.registerFactory(makePokemonFactoryRoute);

    return app.start(process.env.PORT || 3001, (application) => {
      setupSwagger(application);
      this.logger.info(`Server is running on port ${process.env.PORT || 3001}`);
    });
  }
}

export default new App();