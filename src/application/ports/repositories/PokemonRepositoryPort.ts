export interface PokemonRepositoryPort {
  getPokemon(id: number): Promise<{
    id: number;
    type: string;
    trainer: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
  } | null>;

  listPokemons(): Promise<{
    id: number;
    type: string;
    trainer: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
  }[]>;

  createPokemon(type: string, trainer: string): Promise<{
    id: number;
    type: string;
    trainer: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
  }>;

  deletePokemon(id: number): Promise<{
    id: number;
    type: string;
    trainer: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
  }>;

  updateTrainer(id: number, trainer: string): Promise<{
    id: number;
    type: string;
    trainer: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
  }>;

  incrementLevel(pokemon: { id: number; level: number }): Promise<{
    id: number;
    type: string;
    trainer: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
  }>;

  subtractLevel(pokemon: { id: number; level: number }): Promise<{
    id: number;
    type: string;
    trainer: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}