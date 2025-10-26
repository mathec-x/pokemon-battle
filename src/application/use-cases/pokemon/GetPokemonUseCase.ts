import { PokemonMapper } from '@/application/mappers/PokemonMapper';
import { GetPokemonUseCasePort } from '@/application/ports/services/UseCasePorts';
import { NotFoundException } from '@/core/exceptions/NotFoundException';
import { PokemonRepository } from '@/infrastructure/database/repositories/PokemonRepository';

export class GetPokemonUseCase implements GetPokemonUseCasePort {

  constructor(
    private readonly repository: PokemonRepository,
    private readonly mapper: PokemonMapper
  ) { }

  async execute(id: number) {
    const data = await this.repository.getPokemon(id);
    if (!data) {
      throw new NotFoundException(`No pokemon data with id: ${id}`);
    }

    return this.mapper.format(data);
  }
}