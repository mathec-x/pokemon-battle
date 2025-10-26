import { PokemonMapper } from '@/application/mappers/PokemonMapper';
import { ListPokemonUseCasePort } from '@/application/ports/services/UseCasePorts';
import { PokemonRepository } from '@/infrastructure/database/repositories/PokemonRepository';

export class ListPokemonUseCase implements ListPokemonUseCasePort {

  constructor(
    private readonly repository: PokemonRepository,
    private readonly mapper: PokemonMapper
  ) { }

  async execute() {
    const data = await this.repository.listPokemons();
    return this.mapper.many(data);
  }
}