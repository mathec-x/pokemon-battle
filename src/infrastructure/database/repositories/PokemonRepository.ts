import { LoggerService } from '@/application/services/logger/LoggerService';
import { prisma } from '@/infrastructure/database/prisma/client';

export class PokemonRepository {
  private readonly logger = new LoggerService(PokemonRepository.name);

  getPokemon(id: number) {
    return prisma.pokemon.findFirst({ where: { id } });
  }

  listPokemons() {
    return prisma.pokemon.findMany();
  }

  createPokemon(type: string, trainer: string) {
    this.logger.info(`Creating pokemon with type: ${type} for trainer: ${trainer}`);
    return prisma.pokemon.create({
      data: {
        type,
        trainer,
        level: 7
      },
    });
  }

  deletePokemon(id: number) {
    this.logger.info(`Deleting pokemon with id: ${id}`);
    return prisma.pokemon.delete({
      where: { id },
    });
  }

  updateTrainer(id: number, trainer: string) {
    this.logger.info(`Updating pokemon trainer with id: ${id} to trainer: ${trainer}`);
    return prisma.pokemon.update({
      where: { id },
      data: { trainer },
    });
  }

  incrementLevel(pokemon: { id: number; level: number }) {
    this.logger.alert(`Upgrading level for pokemon id: ${pokemon.id} to level ${pokemon.level + 1}`);
    return prisma.pokemon.update({
      where: { id: pokemon.id },
      data: { level: pokemon.level + 1 },
    });
  }

  subtractLevel(pokemon: { id: number; level: number }) {
    const newLevel = pokemon.level > 1 ? pokemon.level - 1 : 1;
    this.logger.alert(`Subtracting level for pokemon id: ${pokemon.id} to level ${newLevel}`);
    return prisma.pokemon.update({
      where: { id: pokemon.id },
      data: { level: newLevel },
    });
  }
}