import { BattleController } from '@/adapters/controllers/battle/battleController';
import { PokemonController } from '@/adapters/controllers/pokemon/pokemonController';
import { PokemonMapper } from '@/application/mappers/PokemonMapper';
import { BattlePokemonUseCase } from '@/application/use-cases/pokemon/BattlePokemonUseCase';
import { CreatePokemonUseCase } from '@/application/use-cases/pokemon/CreatePokemonUseCase';
import { DeletePokemonUseCase } from '@/application/use-cases/pokemon/DeletePokemonUseCase';
import { GetPokemonUseCase } from '@/application/use-cases/pokemon/GetPokemonUseCase';
import { ListPokemonUseCase } from '@/application/use-cases/pokemon/ListPokemonUseCase';
import { UpdatePokemonUseCase } from '@/application/use-cases/pokemon/UpdatePokemonUseCase';
import { PokemonRepository } from '@/infrastructure/database/repositories/PokemonRepository';

const repository = new PokemonRepository();
const mapper = new PokemonMapper();

export const makePokemonFactoryRoute = () => new PokemonController(
  new GetPokemonUseCase(repository, mapper),
  new ListPokemonUseCase(repository, mapper),
  new UpdatePokemonUseCase(repository),
  new DeletePokemonUseCase(repository),
  new CreatePokemonUseCase(repository, mapper)
);

export const makeBattleFactoryRoute = () => new BattleController(
  new BattlePokemonUseCase(repository, mapper)
);
