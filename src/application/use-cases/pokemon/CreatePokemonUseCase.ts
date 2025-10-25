import { PokemonMapper } from '@/application/mappers/PokemonMapper';
import { PokemonRepository } from '@/infrastructure/database/repositories/PokemonRepository';

export class CreatePokemonUseCase {

  constructor(
    private readonly repository: PokemonRepository,
    private readonly mapper: PokemonMapper
  ) { }

  async execute(type: string, trainer: string) {
    const data = await this.repository.createPokemon(type, trainer);

    if (!data) {
      throw new Error('Erro ao criar pokémon');
    }

    return this.mapper.format(data);
  }
}