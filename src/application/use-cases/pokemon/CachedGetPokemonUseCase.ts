import { PokemonMapper } from '@/application/mappers/PokemonMapper';
import { CacheGatewayPort } from '@/application/ports/gateways/ExternalGatewayPorts';
import { GetPokemonUseCasePort } from '@/application/ports/services/UseCasePorts';
import { LoggerService } from '@/application/services/logger/LoggerService';
import { NotFoundException } from '@/core/exceptions/NotFoundException';
import { PokemonRepository } from '@/infrastructure/database/repositories/PokemonRepository';

/**
 * GetPokemonUseCase com Cache - Exemplo de como usar Ports para adicionar cache
 * 
 * Esta implementação adiciona cache ao use case original sem modificar
 * a lógica de negócio principal, demonstrando a flexibilidade dos ports.
 */
export class CachedGetPokemonUseCase implements GetPokemonUseCasePort {
  private readonly logger = new LoggerService(CachedGetPokemonUseCase.name);

  constructor(
    private readonly repository: PokemonRepository,
    private readonly mapper: PokemonMapper,
    private readonly cache: CacheGatewayPort
  ) { }

  async execute(id: number): Promise<{
    id: number;
    nivel: number;
    tipo: string;
    treinador: string;
  }> {
    const cacheKey = `pokemon:${id}`;

    try {
      // Tenta buscar no cache primeiro
      const cachedPokemon = await this.cache.get<{
        id: number;
        nivel: number;
        tipo: string;
        treinador: string;
      }>(cacheKey);
      if (cachedPokemon) {
        this.logger.debug(`Pokemon ${id} found in cache`);
        return cachedPokemon;
      }

      // Se não encontrou no cache, busca no banco
      this.logger.debug(`Pokemon ${id} not found in cache, fetching from database`);
      const data = await this.repository.getPokemon(id);

      if (!data) {
        throw new NotFoundException(`No pokemon data with id: ${id}`);
      }

      const formattedPokemon = this.mapper.format(data);

      // Armazena no cache por 5 minutos
      await this.cache.set(cacheKey, formattedPokemon, 300);
      this.logger.debug(`Pokemon ${id} cached for 5 minutes`);

      return formattedPokemon;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Em caso de erro do cache, continua sem cache
      this.logger.warn(`Cache error for pokemon ${id}, falling back to database:`, error);

      const data = await this.repository.getPokemon(id);
      if (!data) {
        throw new NotFoundException(`No pokemon data with id: ${id}`);
      }

      return this.mapper.format(data);
    }
  }
}