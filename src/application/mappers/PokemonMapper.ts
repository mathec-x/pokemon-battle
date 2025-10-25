
interface PokemonData {
  id: number;
  level: number;
  type: string;
  trainer: string;
}

export class PokemonMapper {
  format(data: PokemonData) {
    return {
      id: data.id,
      nivel: data.level,
      tipo: data.type,
      treinador: data.trainer
    };
  }

  many(data: PokemonData[]) {
    return data.map(item => this.format(item));
  }
}