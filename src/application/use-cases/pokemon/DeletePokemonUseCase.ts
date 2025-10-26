import { DeletePokemonUseCasePort } from '@/application/ports/services/UseCasePorts';
import { PokemonRepository } from '@/infrastructure/database/repositories/PokemonRepository';

export class DeletePokemonUseCase implements DeletePokemonUseCasePort {

  constructor(
    private readonly repository: PokemonRepository
  ) { }

  async execute(id: number) {
    return this.repository.deletePokemon(id);
  }
}