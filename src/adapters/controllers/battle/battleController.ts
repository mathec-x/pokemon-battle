import { HttpError } from '@/adapters/http/errors/handler';
import { OpenApiAdapter } from '@/adapters/http/openapi/OpenApiAdapter';
import { BattlePokemonUseCase } from '@/application/use-cases/pokemon/BattlePokemonUseCase';
import {
  pokemonBattleResponseSchema
} from '@/infrastructure/http/schemas/pokemon.schema';

export class BattleController extends OpenApiAdapter {
  constructor(
    private readonly battlePokemon: BattlePokemonUseCase,
  ) {
    super();
    this.route.post('/battle/:id1/:id2', {
      response: pokemonBattleResponseSchema.meta({ statusCode: 200 })
    }, async (req, res) => {
      try {
        const output = await this.battlePokemon.execute(Number(req.params.id1), Number(req.params.id2));
        res.json(output);
      } catch (error) {
        return new HttpError().handle(req, res, error);
      }
    });
  }
}
