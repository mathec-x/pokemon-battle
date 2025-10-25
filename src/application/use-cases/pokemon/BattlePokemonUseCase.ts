import { PokemonMapper } from '@/application/mappers/PokemonMapper';
import { LoggerService } from '@/application/services/logger/LoggerService';
import { NotFoundException } from '@/core/exceptions/NotFoundException';
import { PokemonRepository } from '@/infrastructure/database/repositories/PokemonRepository';

export class BattlePokemonUseCase {
  private readonly logger = new LoggerService(BattlePokemonUseCase.name);

  constructor(
    private readonly repository: PokemonRepository,
    private readonly mapper: PokemonMapper
  ) { }

  async execute(id1: number, id2: number) {
    const pokemon1 = await this.repository.getPokemon(id1);
    const pokemon2 = await this.repository.getPokemon(id2);

    if (!pokemon1) {
      throw new NotFoundException(`Pokémon ${id1} não encontrado`);
    }
    if (!pokemon2) {
      throw new NotFoundException(`Pokémon ${id2} não encontrado`);
    }

    this.logger.warn(`Batalha entre ${pokemon1.type} e ${pokemon2.type} iniciada!`);
    const totalLevel = pokemon1.level + pokemon2.level;
    const pokemon1Probability = pokemon1.level / totalLevel;
    const randomValue = Math.random();
    const pokemon1Wins = randomValue < pokemon1Probability;

    this.logger.warn(`${pokemon1.type} (nível ${pokemon1.level}) vs ${pokemon2.type} (nível ${pokemon2.level})`);
    this.logger.warn(`Probabilidade ${pokemon1.type}: ${(pokemon1Probability * 100).toFixed(1)}%`);
    // pausa dramática
    await Promise.resolve(() => setTimeout(() => { }, 1000));
    this.logger.warn(`Valor aleatório: ${randomValue.toFixed(3)}`);
    this.logger.warn(`Vencedor: ${pokemon1Wins ? pokemon1.type : pokemon2.type}`);

    const power1 = pokemon1Wins ? 1 : 0;
    const power2 = pokemon1Wins ? 0 : 1;

    let winner: typeof pokemon1;
    let looser: typeof pokemon2;
    if (power1 >= power2) {
      winner = pokemon1;
      looser = pokemon2;
    } else {
      winner = pokemon2;
      looser = pokemon1;
    }

    await this.repository.incrementLevel(winner);
    if (looser.level > 1) {
      await this.repository.subtractLevel(looser);
    } else {
      this.logger.critical(`O POKEMON ${looser.type} MORREU!. (${looser.trainer})`);
      await this.repository.deletePokemon(looser.id);
    }

    return {
      vencedor: this.mapper.format({ ...winner, level: winner.level + 1 }),
      perdedor: this.mapper.format({ ...looser, level: looser.level - 1 }),
    };
  }
}