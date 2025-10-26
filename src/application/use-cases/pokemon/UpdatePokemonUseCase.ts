import { UpdatePokemonUseCasePort } from '@/application/ports/services/UseCasePorts';
import { PokemonRepository } from '@/infrastructure/database/repositories/PokemonRepository';

export class UpdatePokemonUseCase implements UpdatePokemonUseCasePort {

  constructor(
    private readonly repository: PokemonRepository
  ) { }

  async execute(id: number, name: string) {
    return this.repository.updateTrainer(id, name);
  }
}