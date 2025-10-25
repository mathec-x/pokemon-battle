import { HttpError } from '@/adapters/http/errors/handler';
import { OpenApiAdapter } from '@/adapters/http/openapi/OpenApiAdapter';
import { BattlePokemonUseCase } from '@/application/use-cases/pokemon/BattlePokemonUseCase';
import { CreatePokemonUseCase } from '@/application/use-cases/pokemon/CreatePokemonUseCase';
import { DeletePokemonUseCase } from '@/application/use-cases/pokemon/DeletePokemonUseCase';
import { GetPokemonUseCase } from '@/application/use-cases/pokemon/GetPokemonUseCase';
import { ListPokemonUseCase } from '@/application/use-cases/pokemon/ListPokemonUseCase';
import { UpdatePokemonUseCase } from '@/application/use-cases/pokemon/UpdatePokemonUseCase';
import {
  createPokemonSchema,
  listPokemonResponseSchema,
  pokemonBattleResponseSchema,
  pokemonParamsSchema,
  pokemonResponseSchema,
  updatePokemonSchema
} from '@/infrastructure/http/schemas/pokemon.schema';

export class PokemonRouter extends OpenApiAdapter {
  constructor(
    private readonly getPokemon: GetPokemonUseCase,
    private readonly listPokemon: ListPokemonUseCase,
    private readonly updatePokemon: UpdatePokemonUseCase,
    private readonly deletePokemon: DeletePokemonUseCase,
    private readonly createPokemon: CreatePokemonUseCase,
    private readonly battlePokemon: BattlePokemonUseCase,
  ) {
    super();
    this.route.get('/pokemons', {
      response: listPokemonResponseSchema.meta({ statusCode: 200 })
    }, async (req, res) => {
      try {
        const output = await this.listPokemon.execute();
        res.json(output);
      } catch (error) {
        return new HttpError().handle(req, res, error);
      }
    });

    this.route.get('/pokemons/:id', {
      params: pokemonParamsSchema,
      response: pokemonResponseSchema.meta({ statusCode: 200 })
    }, async (req, res) => {
      try {
        const output = await this.getPokemon.execute(Number(req.params.id));
        res.json(output);
      } catch (error) {
        return new HttpError().handle(req, res, error);
      }
    });

    this.route.post('/pokemons', {
      body: createPokemonSchema,
      response: pokemonResponseSchema.meta({ statusCode: 201 })
    }, async (req, res) => {
      try {
        const output = await this.createPokemon.execute(req.body.type, req.body.trainer);
        res.json(output);
      } catch (error) {
        return new HttpError().handle(req, res, error);
      }
    });

    this.route.put('/pokemons/:id', {
      body: updatePokemonSchema,
      params: pokemonParamsSchema.meta({ statusCode: 204 })
    }, async (req, res) => {
      try {
        await this.updatePokemon.execute(Number(req.params.id), req.body.trainer);
        res.end();
      } catch (error) {
        return new HttpError().handle(req, res, error);
      }
    });

    this.route.delete('/pokemons/:id', {
      params: pokemonParamsSchema.meta({ statusCode: 204 })
    }, async (req, res) => {
      try {
        await this.deletePokemon.execute(Number(req.params.id));
        res.end();
      } catch (error) {
        return new HttpError().handle(req, res, error);
      }
    });

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
