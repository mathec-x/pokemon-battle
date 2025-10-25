import { PokemonRepository } from '@/infrastructure/database/repositories/PokemonRepository';

export class UpdatePokemonUseCase {

  constructor(
    private readonly repository: PokemonRepository
  ) { }

  async execute(id: number, name: string) {
    return this.repository.updateTrainer(id, name);
  }
}