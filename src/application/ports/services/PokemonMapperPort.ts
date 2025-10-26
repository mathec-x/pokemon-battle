export interface PokemonMapperPort {
  format(data: {
    id: number;
    level: number;
    type: string;
    trainer: string;
  }): {
    id: number;
    nivel: number;
    tipo: string;
    treinador: string;
  };

  many(data: {
    id: number;
    level: number;
    type: string;
    trainer: string;
  }[]): {
    id: number;
    nivel: number;
    tipo: string;
    treinador: string;
  }[];
}