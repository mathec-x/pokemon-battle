import { PokemonRepository } from '@/infrastructure/database/repositories/PokemonRepository';

export class DeletePokemonUseCase {

  constructor(
    private readonly repository: PokemonRepository
  ) { }

  async execute(id: number) {
    return this.repository.deletePokemon(id);
  }
}